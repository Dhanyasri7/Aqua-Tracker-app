window.onload = () =>{
    checkReset();
    updateIntake();
    showHistory();
    requestNotificationPermission();
}

function startApp(){
    document.querySelector(".welcome-screen").style.display = "none";
    document.querySelector(".dashboard").style.display = "block";
    document.getElementById("navbar").style.display = "flex";
}

let intake = 0;
let goal = parseInt(localStorage.getItem("goal")) || 2000;

function updateIntake(){
    let intake = parseInt(localStorage.getItem("intake")) || 0;
    goal = parseInt(localStorage.getItem("goal")) || 2000;
    document.getElementById("water-intake").innerText=intake;
    document.getElementById("goal-value").innerText=goal;
}

function addWater(){
    let amount=prompt("Enter amount of water in ml: ");
    if (amount && !isNaN(amount)){
        intake += parseInt(amount);
        document.getElementById("water-intake").innerText = intake;
        localStorage.setItem("intake", intake);
        localStorage.setItem("lastDate", new Date().toLocaleDateString());
        saveHistory(parseInt(amount));
        const percent=Math.min(Math.round((intake/goal)*100),100);
        document.getElementById("circleFill").style.height=percent+"%";
        document.getElementById("circlePercent").textContent=percent+"%";
        document.getElementById("water-intake").textContent=intake;
        document.getElementById("goal-value").textContent=goal;
        if (intake >= goal ){
            alert("🎉✨🎆Great Job!! You've reached your daily goal. Stay hydrated!!🎆✨🎉");
           // goalReached=true;
        }
    }
}

function checkReset(){
    const lastDate = localStorage.getItem("lastDate");
    const today = new Date().toLocaleDateString();
    if (lastDate !== today){
        localStorage.setItem("intake", 0);
        localStorage.setItem("lastDate", today);
    }
}

function goTo(page){
    document.querySelector(".dashboard").style.display = "none";
    document.querySelector(".welcome-screen").style.display = "none";
    document.querySelector(".settings").style.display = "none";
    document.querySelector(".history").style.display = "none";
    document.querySelector("."+ page).style.display = "block";
    if (page === "history") showHistory();
}

function saveSettings(){
    const input=document.getElementById("goalInput").value;
    if (input && !isNaN(input)){
        goal=parseInt(input);
        localStorage.setItem("goal", goal);
        alert("✨Goal updated!!✨");
        updateIntake();
        goTo("dashboard");
    }
}

function resetSettings(){
     const confirmReset = confirm("Are you sure you want to reset everything?");

  if (confirmReset) {
    // Reset count, goal, progress
    const defaultGoal=2000;
    localStorage.setItem("intake", 0);
    localStorage.setItem("goal", defaultGoal);
    localStorage.setItem("lastDate", new Date().toLocaleDateString());
    alert("🔄 Everything has been reset. Let's start fresh!");
    document.getElementById("circle-fill").style.height = "0%";
    document.getElementById("circlePercent").textContent = "0%";
    // Reset display
    document.getElementById("water-intake").textContent = "0";
    document.getElementById("goal-value").textContent = defaultGoal;
    const goalInput =document.getElementById("goalInput");
    if (goalInput) goalInput.value="";

    // Reset user's water input value
    const userInput = document.getElementById("inputWater");
    if (userInput) userInput.value = "";

    
  }
}

function saveHistory(amount){
    const today=new Date().toLocaleDateString();
    let history=JSON.parse(localStorage.getItem("history")) || [];
    const existing=history.find(h => h.date === today);
    if(existing){
        existing.amount+=amount;
    }
    else{
        history.push({ date: today, amount: amount });
        if (history.length > 7) history.shift();
    }
    localStorage.setItem("history", JSON.stringify(history));
}

function showHistory(){
    const history=JSON.parse(localStorage.getItem("history")) || [];
    const list=document.getElementById("historyList");
    list.innerHTML="";
    history.forEach(h => {
        const li=document.createElement("li");
        li.textContent= h.date + ":" + h.amount + "ml";
        list.appendChild(li);
    });
    console.log("Updated history:",history);
}

function requestNotificationPermission() {
  if (!("Notification" in window)) {
    alert("This browser does not support desktop notification");
  } else if (Notification.permission === "granted") {
    scheduleNotification();
  } else if (Notification.permission !== "denied") {
    Notification.requestPermission().then(permission => {
      if (permission === "granted") {
        scheduleNotification();
      }
    });
  }
}

function scheduleNotification() {
    setTimeout(() => {
        new Notification("AquaTrack Reminder", {
            body: "Time to drink some water! 💧 Stay hydrated!",
            icon: "https://www.shutterstock.com/image-vector/drink-water-concept-flat-vector-600nw-1315876652.jpg",
        });
    scheduleNotification();
  }, 3600000); //1 hour
}
