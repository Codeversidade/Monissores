const logarComGoogleBtn = document.getElementById('logarComGoogleBtn');
const deslogarDoGoogleBtn = document.getElementById('deslogarDoGoogleBtn');
const addAluno = document.getElementById('addAluno');
const editAluno = document.getElementById('editAluno');
const removeAluno = document.getElementById('removeAluno');

const auth = firebase.auth();
const provider = new firebase.auth.GoogleAuthProvider();

/// Sign in event handlers

logarComGoogleBtn.onclick = () => auth.signInWithPopup(provider);

deslogarDoGoogleBtn.onclick = () => auth.signOut();

const db = firebase.firestore();
let alunosRef;
let unsubscribe;

auth.onAuthStateChanged(user => {
  if (user) {
    // Quando o usuário Logar essa parte será executada
    secaoPrincipal.hidden = false;
    secaoLogin.hidden = true;
    userDetails.innerHTML = `<h3>Hello ${user.displayName}!</h3> <p>User ID: ${user.uid}</p>`;

    alunosRef = db.collection('alunos');

    addAluno.onclick = () => setarAluno(user, alunosRef, 'Carlos N', 2020123457);
    editAluno.onclick = () => editarAluno(user, alunosRef, 'Pedro', 2020123457, [2, 0, 0, 0]);
    removeAluno.onclick = () => removerAluno(user, alunosRef, 2020123457);

    // Pega os dados dos alunos cadastrados no servidor e exibe eles na tela
    unsubscribe = exibirListaDeAlunos(user, alunosRef);

  } else {
    //  Quando o usuário estiver deslogado essa parte será executada
    secaoPrincipal.hidden = true;
    secaoLogin.hidden = false;
    userDetails.innerHTML = '';
  }
});

function setarAluno(user, collectionRef, nome, matricula) {
  collectionRef
    .doc(`${user.uid}.A${matricula}`)
    .get()
    .then(doc => {
      let alunoExiste = doc.exists;

      collectionRef
        .doc(`${user.uid}.A${matricula}`)
        .set({
          uid: user.uid,
          nome: nome,
          matricula: matricula,
          frequencia: [0, 0, 0, 0],
        })
        .then(() => {
          if (alunoExiste) console.log('Editamos o aluno.');
          else console.log('Adicionamos o aluno.');
        })
        .catch(e => {
          console.error('Error adding document: ', e);
        });
    })
    .catch(error => {
      console.log('Error getting document:', error);
    });
}

function removerAluno(user, collectionRef, matricula) {
  collectionRef
    .doc(`${user.uid}.A${matricula}`)
    .delete()
    .then(() => {
      console.log(`Deletamos aluno A${matricula}`);
    })
    .catch(error => {
      console.log('Error deletting document:', error);
    });
}

function editarAluno(user, collectionRef, nome, matricula, frequencia) {
    collectionRef
      .doc(`${user.uid}.A${matricula}`)
      .update({
        nome: nome,
        matricula: matricula,
        frequencia: frequencia,
      })
      .then(() => {
          console.log("Editamos o aluno.");
      })
      .catch((error) => {
          // Se der erro o documento provavelmente não existe.
          console.error("Error updating document: ", error);
      });
}


function exibirListaDeAlunos(user, collectionRef) {
    unsubscribe = collectionRef
    .where('uid', '==', user.uid)
    .onSnapshot(querySnapshot => {
      const items = querySnapshot.docs.map(doc => {
        return `<li>${doc.data().nome} \(${doc.data().matricula}\) ${doc.data().frequencia[0]}</li>`;
      });
      alunosLista.innerHTML = items.join('');
    });

    return unsubscribe
}