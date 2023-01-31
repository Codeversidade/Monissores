const enviarBtn = document.getElementById('enviarChamadaBtn');
const nomeInput = document.getElementById('nomeChamadaInput');
const matriculaInput = document.getElementById('matriculaChamadaInput');

const paramsString = window.location.search;
const searchParams = new URLSearchParams(paramsString);

const db = firebase.firestore();

chamadaRef = db.collection('chamada');
chamadaRef
  .doc(`${searchParams.get('code')}`)
  .get()
  .then(doc => {
    var chamadaAtiva = doc.data().chamadaAtiva;

    if (chamadaAtiva) {
      secaoChamadaInativa.hiden = true;
      enviarBtn.onclick = () => {
        
        if (checarInputs()) {
            chamadaRef
              .doc(`${searchParams.get('code')}.A${matriculaInput.value}`)
              .set({
                code: searchParams.get('code'),
                nome: nomeInput.value,
                matricula: parseInt(matriculaInput.value),
              })
              .then(() => {
                  console.log(`Aluno A${matriculaInput.value} preencheu a chamada.`)
                  secaoChamadaPreenchida.hidden = false
                  secaoChamadaAtiva.hidden = true
              })
              .catch(e => {
                console.error('Error adding document: ', e);
              });
        }
      };
    } else {
      secaoChamadaAtiva.hidden = true;
      secaoChamadaInativa.hidden = false;
    }
  })
  .catch(error => {
    console.log('Essa chamada não existe ou não está ativa no momento.', error);
    secaoChamadaAtiva.hidden = true;
    secaoChamadaInativa.hidden = false;
  });

function checarInputs() {
    
    if (nomeInput.value == '' || matriculaInput.value == '')
    {
        window.alert('O nome e o número de matrícula devem ser preenchidos.');
    }
    else if (parseInt(matriculaInput.value) < 2008100000) {
        window.alert('O número de matrícula informado é inválido.');
    }
    else if (!/^[0-9]+$/.test(matriculaInput.value))
    {
        window.alert('O número de matrícula só pode conter números.');
    }
    else
    {
        return true;
    }
    return false;
}