const urlLab = "https://www.youtube.com/watch?v=QH2-TGUlwu4";

let fechaCuentaRegresiva = "2023/04/30 21:48:59";
let cuentaRegresiva = new Date(fechaCuentaRegresiva).getTime();

var x = setInterval(function () {
  var ahora = new Date().getTime();
  var distancia = cuentaRegresiva - ahora;
  var dias = Math.floor(distancia / (1000 * 60 * 60 * 24));
  var horas = Math.floor(
    (distancia % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
  );
  var minutos = Math.floor((distancia % (1000 * 60 * 60)) / (1000 * 60));
  var segundos = Math.floor((distancia % (1000 * 60)) / 1000);
  console.log(distancia);
  if (dias < 10) {
    dias = "0" + dias;
  }
  if (minutos < 10) {
    minutos = "0" + minutos;
  }
  if (horas < 10) {
    horas = "0" + horas;
  }
  if (segundos < 10) {
    segundos = "0" + segundos;
  }
  if (dias > 10 && minutos > 10 && horas > 10 && segundos > 10) {
    document.getElementById("fecha").innerHTML =
      dias + ":" + horas + ":" + minutos + ":" + segundos;
  } else {
    document.getElementById("fecha").innerHTML =
      dias + ":" + horas + ":" + minutos + ":" + segundos;
  }
  if (distancia < 0) {
    clearInterval(x);
    document.getElementById("reloj").innerHTML =
      '<p class="container-text-center" style="font-size: 18px;">' +
      "Redireccionando..." +
      "</p>";
    document.getElementById("fecha").innerHTML = "";
    window.location.replace(urlLab);
  }
}, 1000);
