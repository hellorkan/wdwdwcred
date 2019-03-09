const Discord = require("discord.js");
const client = new Discord.Client();
const fs = require("fs"); // npm i fs

let credit = require("./credits.json");
let daily = require("./daily.json");

// This bot created by ! BeeGet³~
// Please check the token!

// v settings v

var token = 'NTUzNjk5MzA2ODU1NTk2MDMy.D2VT9g.3J6hTJemrpe2AzxtUSqjCPeuTOg'; // <-- bot token
let mincredit = 1;
let maxcredit = 1;
var prefix = '$';

// ^ settings ^

function checkuser(id) {
 if (!credit[id]) {
     credit[id] = {
        credits: 0
     };
 }
}

function randomcredit(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function add(id, amount) {
  credit[id] = {
    credits: (credit[id].credits + amount)
 };
 fs.writeFile("./credits.json", JSON.stringify(credit), (err) => {
  if (err) console.log(err)
});
}

function remove(id, amount) {
  credit[id] = {
    credits: (credit[id].credits - amount)
 };
 fs.writeFile("./credits.json", JSON.stringify(credit), (err) => {
  if (err) console.log(err)
});
}

function sendto(id, id2, amount, amount2) {
  credit[id] = {
     credits: (credit[id].credits - amount)
  };

  credit[id2] = {
    credits: (credit[id2].credits + amount2)
 };
 fs.writeFile("./credits.json", JSON.stringify(credit), (err) => {
  if (err) console.log(err)
});
}

function dailyto(id, date) {
  daily[id] = {
    d: date
 };
 fs.writeFile("./daily.json", JSON.stringify(daily), (err) => {
  if (err) console.log(err)
});
}

client.on('message', message => {
  if (message.channel.type == "dm") return;

  checkuser(message.author.id);

  // commands
  if (message.content.startsWith(prefix)) {
  const args = message.content.slice(prefix.length).trim().split(/ +/g);
  const command = args.shift().toLowerCase();

  if (command === "daily") {
    if (!daily[message.author.id]) {
      dailyto(message.author.id, 0);
    }

    var ddate = new Date(daily[message.author.id].d).getTime();

  // Get todays date and time
  var now = new Date().getTime();
    
  // Find the distance between now and the count down date
  var distance = ddate - now;
    
  // Time calculations for days, hours, minutes and seconds
  var days = Math.floor(distance / (1000 * 60 * 60 * 24));
  var hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
  var seconds = Math.floor((distance % (1000 * 60)) / 1000);
    
  if (distance < 0) {
    let creddaily = randomcredit(100, 500);
    message.channel.send('**:atm:  |  ' + message.author.username + ', you received your :yen: ' + creddaily + ' daily credits!**');
    add(message.author.id, creddaily);

    var date = new Date();
    date.setDate(date.getDate() + 1);

    dailyto(message.author.id, date);
    return;
  }

  var timestr = '';
  
  if (days > 0) {
    timestr = timestr + days + ' days,';
  }
  if (hours > 0) {
    timestr = timestr + hours + ' hours,';
  }
  if (minutes > 0) {
    timestr = timestr + minutes + ' minutes,';
  }
  timestr = timestr + seconds + ' seconds ...';
    
  // Output the result in an element with id="demo"
  message.channel.send(':stopwatch: :  **Please cool down ' + timestr + '** ');
  }

  if (command === "credits" || command === "credit") {
 
    let member = message.mentions.members.first();
    if (!member) {
    let creditsn = credit[message.author.id].credits;

    message.channel.send("**" + message.author.username + ", your :credit_card: balance is `$" + creditsn + "`.**");
    } else {
    if (!credit[member.id]) {
    message.channel.send("**:interrobang: | " + message.author.username + ", I can't find " + member + "**");
    return;
    };
    
    if (args.length === 1) {
    let creditsn2 = credit[member.id].credits;

    message.channel.send("**" + member.user.username + " :credit_card: balance is `$" + creditsn2 + "`.**");
    } else if (args.length === 2) {
      let cs = args[1];
      let creditsn = credit[message.author.id].credits;

      if (cs < 0 || isNaN(cs)) {
    message.channel.send("**:interrobang: | " + message.author.username + ", type the credit you need to transfer!**");
    return;
      }

      if (cs > creditsn) {
    message.channel.send("**:thinking: | " + message.author.username + ", Your balance is not enough for that!**");
    return;
      }

      let code = randomcredit(1000, 9999);

      let fee = 0;
      let credits23 = cs;
      let amount = 0;

      if (credits23 == 0) {
        amount=0;
        fee=0;
      } else if (credits23 > 50) {
      amount=credits23 - ( credits23*1/100 ).toFixed(0);
      fee=( credits23*1/100 ).toFixed(0);
      } else {
        amount=credits23 - 1;
        fee=1;
      }

      message.channel.send("**" + message.author.username + ", Transfer Fees: `" + fee + "`, Amount :`$" + amount + "`**\n type these numbers to confirm:\n" + code).then(mssg => {
      
message.channel.awaitMessages(msg => msg.author == message.author, {
  max: 1,
  time: 60000,
  error: ["time"]
  }).then(function(msgs){
    mssg.delete();
    if (msgs.first().content === '' + code) {

       let rid = randomcredit(100000000000000000, 999999999999999999);

      sendto(message.author.id, member.user.id, credits23, amount)
      message.channel.send("**:moneybag: | " + message.author.username + ", has transferred `$" + amount + "` to " + member + "**");
      member.send(':atm:  |  Transfer Receipt\n```You have received $ ' + amount + ' from user ' + message.author.username + ' (ID: ' + rid + ')```');

    }
  });
});

    }
   }
  }

 if (command === "credithelp") {
  message.author.send("**الأوامر العامة**\n**$daily**  : الحصول على الراتب اليومي\n**$credits**  : التحويل ومعرفة الرصيد\n \n**this code made by ! BeeGet³~#0863**");
 }
  }
  // commands

  let random1 = Math.floor(Math.random() * 20) + 1;
  let random2 = Math.floor(Math.random() * 20) + 1;

  if (random1 > random2) {
    credit[message.author.id] = {
       credits: credit[message.author.id].credits + randomcredit(mincredit, maxcredit)
    };
  }

  fs.writeFile("./credits.json", JSON.stringify(credit), (err) => {
    if (err) console.log(err)
  });

});


client.login(token);

// copyright by Perks Developers!