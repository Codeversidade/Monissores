const enviarBtn = document.getElementById('enviarChamadaBtn')
const nomeInput = document.getElementById("nomeChamadaInput")
const matriculaInput = document.getElementById("matriculaChamadaInput")

const paramsString = window.location.search;
const searchParams = new URLSearchParams(paramsString);

const db = firebase.firestore();


chamadaRef = db.collection('chamada')

chamadaRef
        .doc(`${searchParams.get('code')}`)
        .get().then((doc) => {
            var chamadaAtiva = doc.data().chamadaAtiva

            if (chamadaAtiva)
            {
                secaoChamadaInativa.hiden = true
                enviarBtn.onclick = () => { 
                    chamadaRef
                        .doc(`${searchParams.get('code')}.A${matriculaInput.value}`)
                        .get().then((doc) => {
                        let alunoExiste = doc.exists
                        
                        var frequencia = alunoExiste ? doc.data().frequencia : [0,0,0,0];
                        frequencia[searchParams.get('index')] += 1;
                
                        chamadaRef
                        .doc(`${searchParams.get('code')}.A${matriculaInput.value}`)
                        .set
                        ({
                            uid: searchParams.get('code'),
                            nome: nomeInput.value,
                            matricula: matriculaInput.value,
                            frequencia: frequencia,
                        }).catch((e) =>{
                            console.error("Error adding document: ", e);
                        })
                    }).catch((error) => {
                        console.log("Error getting document:", error);
                    });
                }
            }
            else 
            {
                secaoChamadaAtiva.hidden = true
                secaoChamadaInativa.hidden = false
            }
        }).catch((error) => {
            console.log("Essa chamada não existe ou não está ativa no momento.", error);
            secaoChamadaAtiva.hidden = true
            secaoChamadaInativa.hidden = false
        });

