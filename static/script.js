const realSOC=[];
const predictedSOC=[];
var length=0
const label=[]
var SOH
document.addEventListener('DOMContentLoaded', (event) => {
    function fetchData() {
        fetch('/data')
            .then(response => response.json())
            .then(data => {
                if (data.error) {
                    console.error('Error:', data.error);
                } else {
                    
                    document.getElementById('courant').innerText = data.Courant;
                    document.getElementById('tension').innerText = data.Tension;
                    document.getElementById('temperature').innerText = data.Temperature;
                    document.getElementById('SOC_Real').innerText = data.SOC_Real;
                    document.getElementById('soc').innerText = data.SOC_Prediction;
                    SOH=data.SOH
                    changeBattery();
                    if(data.SOC_Real!=realSOC[length-1]){
                    realSOC[length]=data.SOC_Real
                    predictedSOC[length]=data.SOC_Prediction[0]
                    label[length]=length*5
                    length++
                    myChart.update();
                    
                }
                }
            })
            .catch(error => console.error('Error fetching data:', error));
    }

    document.getElementById('fetch-data-button').addEventListener('click', fetchData);
    var data = {
        labels:label
         ,
        datasets: [{
          label: 'Predicted SOC',
          fill:false,
          backgroundColor: 'rgba(220, 0, 0, 1)',
          borderColor: 'rgba(255, 0, 0, 1)',
          borderWidth: 0,
          data:predictedSOC,
        },{
            label: 'Real SOC',
            backgroundColor: 'blue',
            borderColor: 'rgba(10, 162, 235, 1)',
            borderWidth: 1,
            fill:false,
            data: realSOC
            
          }]
      };
    
      // Configuration options for the chart
      var options = {
        responsive:false,
        scales: {
          yAxes: [{
            ticks: {
              beginAtZero: true
            }
          }]
        }
      };
      const ctx = document.getElementById('myChart');
var myChart = new Chart(ctx, {
    type: 'line', 
    data: data, 
    options: options 
  });
  
    fetchData();
    setInterval(fetchData, 5000);
});
function changeBattery(){
    
    const battery=document.getElementById('battery_level')
    
    if(realSOC[length-1]<0.5){
    battery.style.background='rgb(255'+','+(255*(realSOC[length-1])*2)+',0)'
    console.log(255*(realSOC[length-1])*2)}
    else
    battery.style.background='rgb('+255*((1-realSOC[length-1])*2)+',255'+',0)'
    battery.style.height=(realSOC[length-1]*100).toString().concat("%")
    if(SOH>0.8)
        document.getElementById('soh_message').innerHTML='your Battery is health is good'
    else
        document.getElementById('soh_message').innerHTML='you should change your battery '
}
