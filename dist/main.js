console.log("main.ts -> OK");
const fileInput = document.getElementById('fileUpload');
const result = document.getElementById('result');
const historyLogs = document.getElementById('historyLogs');
const nofiledetected = document.querySelectorAll('.nofiledetected');
const informationLogs = document.querySelector('.informationLogs');
const review = document.querySelector('.review ul');
const reviewLogsLine = document.querySelectorAll(".reviewsLogsLine");
let logsArray = [];
let pos = 0;
fileInput.addEventListener('change', (event) => {
    const target = event.target;
    if (target.files && target.files[0]) {
        const file = target.files[0];
        const reader = new FileReader();
        reader.onload = (e) => {
            var _a;
            const fileContent = (_a = e.target) === null || _a === void 0 ? void 0 : _a.result;
            if (fileContent) {
                const lines = fileContent.split('\n');
                // TODO corriger erreur
                // let htmlContent = lines.map(line => `<p>${line}</p>`).join('');
                logsArray.push(lines);
                if (result) {
                    // result.innerHTML = htmlContent;
                }
                console.log(fileContent);
                // remove nofiledetected
                if (nofiledetected) {
                    nofiledetected.forEach(element => {
                        element.remove();
                    });
                }
                logsArray = lines;
                lines.forEach(line => {
                    const parts = cutLogsPart(line);
                    console.log(parts);
                    let status = parts[0];
                    let divclass = "";
                    if (status < 200) {
                        divclass = "yellow";
                    }
                    else if (status < 300) {
                        divclass = "green";
                    }
                    else if (status < 400) {
                        divclass = "blue";
                    }
                    else if (status < 500) {
                        divclass = "red";
                    }
                    else if (status < 600) {
                        divclass = "purple";
                    }
                    else {
                        divclass = "";
                    }
                    if (pos == 0) {
                        historyLogs.innerHTML = '<a href="?id=' + parts[1] + '"><div class="' + divclass + '"></div></a>';
                    }
                    else {
                        historyLogs.innerHTML += '<a href="?id=' + parts[1] + '"><div class="' + divclass + '"></div></a>';
                    }
                    review.innerHTML += `
                        <li class="reviewsLogsLine" data-id="${parts[1]}">
                            <div class="listinfo">
                                <p><span class="httpcode ${divclass}">${parts[0]}</span></p>
                                <p><span class="id">${parts[1]}</span></p>
                                <p><span class="time"></span>${parts[2]}</p>
                                <p><span class="ip">${parts[3]}</span></p>
                                <p><span class="type ${parts[4]}">[${parts[4]}]</span></p>
                                <p><span>${parts[5]}</span></p>
                                <p><span class="${parts[6]}">${parts[6]}</span></p>
                                <p><span><a href="${parts[7]}">${parts[7]}</a></span></p>
                                <p id="getAcionSeeFullDATA"><span>${parts[9]}</span></p>
                                <p id="actionFullDATA"><span>${parts[10]}</span></p>
                            </div>
                        </li>
                    `;
                    pos++;
                });
            }
        };
        reader.readAsText(file);
    }
});
// const logLine = "[200] [d5e6f7a1b2c3] 2024-08-04 18:06:20.000000 192.168.1.16 [INFO] account_update [HTTP] [http://localhost/account] (http://localhost/dashboard) PUT {\"data\":{\"username\":\"mary\",\"email\":\"mary@example.com\"}}";
// const parts = cutLogsPart(logLine);
// console.log(parts);
function cutLogsPart(logsLine) {
    // Utilisation d'une expression régulière pour extraire les différentes parties de la ligne de logs
    const logParts = logsLine.match(/\[([^\]]+)\]|\(([^)]+)\)|(\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}\.\d+)|(\d{3}\.\d{3}\.\d{3}\.\d{3})|(\{[^}]+\})|(\S+)/g);
    // Traite chaque partie extraite et enlève les symboles de bordures si nécessaires
    return logParts.map(part => {
        if (part.startsWith('[') && part.endsWith(']')) {
            return part.slice(1, -1); // Enlève les crochets
        }
        else if (part.startsWith('(') && part.endsWith(')')) {
            return part.slice(1, -1); // Enlève les parenthèses
        }
        else {
            return part; // Garde le reste tel quel
        }
    });
}
// ? hover history show data
// Écouteur pour le survol
historyLogs.addEventListener('mouseenter', (event) => {
    const target = event.target;
    // Vérifier si l'élément survolé est un lien ou s'il se trouve à l'intérieur d'un lien
    let linkElement = target.closest('a');
    if (linkElement) {
        const href = linkElement.getAttribute('href');
        if (href) {
            let parts = href.split('=');
            if (parts.length > 1) {
                let id = parts[1];
                if (id) {
                    getdata(id); // Appel de votre fonction pour obtenir les données
                    logsArray.forEach(line => {
                        if (line.includes(id)) {
                            console.log("FOUND : " + line);
                            let lineParts = cutLogsPart(line);
                            let status = lineParts[0];
                            let divclass = "";
                            if (status < 200) {
                                divclass = "yellow";
                            }
                            else if (status < 300) {
                                divclass = "green";
                            }
                            else if (status < 400) {
                                divclass = "blue";
                            }
                            else if (status < 500) {
                                divclass = "red";
                            }
                            else if (status < 600) {
                                divclass = "purple";
                            }
                            else {
                                divclass = "";
                            }
                            // Mise à jour de informationLogs
                            informationLogs.innerHTML = `
                            <ul>
                                <div class="type ${divclass}"></div>
                                <li>Code HTTP: <span class="${divclass}">${status}</span></li>
                                <li>ID : <span>${lineParts[1]}</span></li>
                                <li>Date: <span>${lineParts[2]}</span></li>
                                <li>Ip: <span>${lineParts[3]}</span></li>
                                <li>Type: <span>${lineParts[4]}</span></li>
                                <li>Message: <span>${lineParts[5]}</span></li>
                                <li>HTTP(s): <span>${lineParts[6]}</span></li>
                                <li>urlShow: <a href="${lineParts[7]}" target="_blank">${lineParts[7]}</a></li>
                                <li>urlReal: <span>${lineParts[8]}</span></li>
                                <li>GET/POST: <span>${lineParts[9]}</span></li>
                                <li>data: <span class="data">${lineParts[10]}</span></li>
                            </ul>
                        `;
                        }
                    });
                }
            }
        }
    }
}, true);
// ? all reviewsLogsLine clicked event
const reviewDiv = document.querySelector('.review'); // Sélectionnez le bon conteneur parent
reviewDiv.addEventListener('click', (event) => {
    const target = event.target;
    // Vérifiez si l'élément cliqué est un <li> dans la hiérarchie DOM
    if (target.closest('li')) {
        console.log("clicked line : ", target.closest('li'));
        const dataId = target.closest('li').getAttribute('data-id');
        console.log("clicked line ID : ", dataId);
        // ? Afficher dans .showReview
        const showReview = document.querySelector('.showReview');
        logsArray.forEach(element => {
            if (element.includes(dataId)) {
                const elementSplit = cutLogsPart(element);
                const statuselement = elementSplit[0];
                let divclass = "";
                if (statuselement < 200) {
                    divclass = "yellow";
                }
                else if (statuselement < 300) {
                    divclass = "green";
                }
                else if (statuselement < 400) {
                    divclass = "blue";
                }
                else if (statuselement < 500) {
                    divclass = "red";
                }
                else if (statuselement < 600) {
                    divclass = "purple";
                }
                else {
                    divclass = "";
                }
                showReview.innerHTML = `
                    <div class="httpcode ${divclass}">${elementSplit[0]}</div>
                    <div class="id">${elementSplit[1]}</div>
                    <div class="date">${elementSplit[2]}</div>
                    <div class="ip">${elementSplit[3]}</div>
                    <div class="type ${elementSplit[4]}">${elementSplit[4]}</div>
                    <div class="action">${elementSplit[5]}</div>
                    <div class="https ${elementSplit[6]}">${elementSplit[6]}</div>
                    <div class="urlreal"><a href="${elementSplit[7]}" target="_blank">${elementSplit[7]}</a></div>
                    <div class="url"><a href="${elementSplit[8]}" target="_blank">${elementSplit[8]}</a></div>
                    <div class="getpost">${elementSplit[9]}</div>
                    <div class="data"><pre>${elementSplit[10]}</pre></div>
                `;
            }
        });
    }
}, true);
// Écouteur pour la sortie du survol
historyLogs.addEventListener('mouseleave', (event) => {
    informationLogs.innerHTML = "";
}, true);
function getdata(id) {
    console.log(id);
}
