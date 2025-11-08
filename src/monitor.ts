import { exec } from "child_process";
import nodemailer from "nodemailer";

const THRESHOLD = 80; // % CPU usage

function checkLoad() {
  exec("pm2 jlist", (err, stdout) => {
    if (err) return console.error(err);

    const list = JSON.parse(stdout);
    const app = list.find((a: any) => a.name === "file-upload");
    if (!app) return console.log("App not found");

    const cpu = app.monit.cpu;
    console.log(`CPU: ${cpu}%`);

    if (cpu > THRESHOLD) {
      console.log(`⚠️ High CPU detected (${cpu}%)`);
      sendEmail(cpu);
      restartApp();
    }
  });
}

function restartApp() {
  exec("pm2 restart file-upload", (err, stdout) => {
    if (err) console.error("Restart error:", err);
    else console.log("✅ Restarted file-upload app");
  });
}

function sendEmail(cpu: number) {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "yourmail@gmail.com",
      pass: "your-app-password"
    }
  });

  const mailOptions = {
    from: "yourmail@gmail.com",
    to: "yourmail@gmail.com",
    subject: "⚠️ High CPU Alert",
    text: `Server CPU is ${cpu}% on file-upload process.`
  };

  transporter.sendMail(mailOptions, (error:any, info:any) => {
    if (error) console.error(error);
    else console.log("✅ Alert sent:", info.response);
  });
}

setInterval(checkLoad, 60 * 1000);
