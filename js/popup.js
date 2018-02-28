function filter() {
  var input, filter, table, tr, td, i;
  input = document.getElementById("search");
  filter = input.value.toUpperCase();
  table = document.getElementById("currency_table");
  tr = table.getElementsByTagName("tr");
  for (i = 0; i < tr.length; i++) {
    td = tr[i].getElementsByTagName("td")[1];
    if (td) {
      if (td.innerHTML.toUpperCase().indexOf(filter) > -1) {
        tr[i].style.display = "";
      } else {
        tr[i].style.display = "none";
      }
    }       
  }
}

function sendDataReq() {
    $.getJSON('https://api.coinmarketcap.com/v1/ticker/?limit=50', function (data) {
        fillTable(data);
    });
}

function fillTable(data) {
    for (var key in data){
        if (data.hasOwnProperty(key)) {
            var currency = '';
            var price = data[key].price_usd;
            var percent_change_1h = parseFloat(data[key].percent_change_1h).toFixed(2);
            var percent_change_24h = parseFloat(data[key].percent_change_24h).toFixed(2);
            
            var checkWholeNum = data[key].price_usd.split('.');
            if (checkWholeNum[0].length >= 1 && checkWholeNum[0] != '0') {
                price = parseFloat(parseFloat(data[key].price_usd).toFixed(2)).toLocaleString('en');
                var checkPrice = price.split('.');
                if (checkPrice[1] && checkPrice[1].length == 1) price += '0';
            }

            currency += '<tr>'
            currency += '<td>'+(parseInt(key)+1)+'</td>';
            currency += '<td>'+data[key].name+' ('+data[key].symbol+')'+'</td>';
            currency += '<td>'+'$'+price+'</td>';
            if (parseFloat(percent_change_1h) >= 0) {
                currency += '<td id="green">'+percent_change_1h+'%'+'</td>';
            } else if (parseFloat(percent_change_1h) < 0) {
                currency += '<td id="red">'+percent_change_1h+'%'+'</td>';
            } else {
                currency += '<td>N/A</td>';
            }
            if (parseFloat(percent_change_24h) >= 0) {
                currency += '<td id="green">'+percent_change_24h+'%'+'</td>';
            } else if (parseFloat(percent_change_24h) < 0) {
                currency += '<td id="red">'+percent_change_24h+'%'+'</td>';
            } else {
                currency += '<td>N/A</td>';
            }
            currency += '</tr>'
            $('#table_body').append(currency);
        }
    }
}

function updateData(){
    $('#table_body tr').remove();
    sendDataReq();
    chrome.alarms.clear('updateInfo');
    window.location.href="popup.html";
}

document.addEventListener('DOMContentLoaded', function () {
    sendDataReq();
    var el = document.getElementById("search");
    if(el){
        addEventListener("keyup", filter);
    }
    chrome.alarms.create('updateInfo', {periodInMinutes: 5});
    chrome.alarms.onAlarm.addListener(function (al) {
        if (al.name === 'updateInfo') {
            updateData();
        }
    });
});

(function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
(i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
})(window,document,'script','https://www.google-analytics.com/analytics.js','ga');

ga('create', 'UA-112302940-1', 'auto');
ga('send', 'pageview', '/popup.html');
