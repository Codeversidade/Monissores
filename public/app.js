const logarComGoogleBtn = document.getElementById('logarComGoogleBtn');
const deslogarDoGoogleBtn = document.getElementById('deslogarDoGoogleBtn');
const configsBtn = document.getElementById('configsBtn');
const addAluno = document.getElementById('addAluno');
const editAluno = document.getElementById('editAluno');
const removeAluno = document.getElementById('removeAluno');
const salvarAlunoBtn = document.getElementById('salvarAlunoNovoBtn');
const nomeAdicionarAlunoInput = document.getElementById('nomeAdicionarAlunoInput');
const matriculaAdicionarAlunoInput = document.getElementById('matriculaAdicionarAlunoInput');
const alunosLista1 = document.getElementById('alunosLista1');
const groupListMes = document.querySelectorAll('.list-group');
const auth = firebase.auth();
const provider = new firebase.auth.GoogleAuthProvider();
/// Sign in event handlers

logarComGoogleBtn.onclick = () => {
  auth.signInWithPopup(provider);
};

deslogarDoGoogleBtn.onclick = () => auth.signOut();

const db = firebase.firestore(); //Teste
let alunosRef;
let unsubscribe;

auth.onAuthStateChanged(user => {
  if (user) {
    //console.log(firebase)
    // Quando o usuário Logar essa parte será executada
    secaoPrincipal.hidden = false;
    secaoLogin.hidden = true;
    userDetails.innerHTML = `<h3>${user.displayName}!</h3> <p>User ID: ${user.uid}</p>`;
    configsBtn.src = user.photoURL
    

    alunosRef = db.collection('alunos');
    /*setarAluno(user, alunosRef, 'Luiz Algusto', 2020123459);
    setarAluno(user, alunosRef, 'Inácio Estácio de Sá', 2020123460);
    setarAluno(user, alunosRef, 'Florisvalda Hortência Tulipa', 2020123463);*/
    salvarAlunoBtn.onclick = () => {
      salvarAluno(user, alunosRef, nomeAdicionarAlunoInput.value, parseInt(matriculaAdicionarAlunoInput.value));
      //attListGroup();
    };
    
      
    //addAluno.onclick = () => setarAluno(user, alunosRef, 'Carlos N', 2020123457);
    //editAluno.onclick = () => editarAluno(user, alunosRef, 'Pedro', 2020123457, [2, 0, 0, 0]);
    //removeAluno.onclick = () => removerAluno(user, alunosRef, 2020123457);

    // Pega os dados dos alunos cadastrados no servidor e exibe eles na tela
    exibirListaDeAlunos(user, alunosRef, alunosLista1, 0);
    exibirListaDeAlunos(user, alunosRef, alunosLista2, 1);
    exibirListaDeAlunos(user, alunosRef, alunosLista3, 2);
    unsubscribe = exibirListaDeAlunos(user, alunosRef, alunosLista4, 3);

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

      if(!alunoExiste){
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
      }else{console.log('Aluno existente')
      }
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

function salvarAluno(user, collectionRef, name, matricula){
  setarAluno(user, collectionRef, name, matricula)
}

function selectItemList(info){
  console.log(info[0]);
  console.log(info[1]);

  var listItems = $(".list-group-item");

  // Remove 'active' tag for all list items
  for (let i = 0; i < listItems.length; i++) {
    listItems[i].classList.remove("active");
  }
  // Add 'active' tag for currently selected item
  document.getElementById(`${info[1]}`).classList.add("active");
}

function exibirListaDeAlunos(user, collectionRef, listGroup, frequenciaIndex) {
    unsubscribe = collectionRef
    .where('uid', '==', user.uid)
    .onSnapshot(querySnapshot => {
      const items = querySnapshot.docs.map(doc => {
        return `<a href="#" id="${doc.data().matricula}" onclick="selectItemList(['${doc.data().nome}', ${doc.data().matricula}]) "class="list-group-item list-group-item-action flex-column align-items-start">
            <!--Dados aluno-->
            <div style="float: left; margin-left: 10px;">
              <span class="material-symbols-outlined">person</span>
              <label " class= "user name ${doc.data().matricula}" style="vertical-align: top; max-width: 350px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${doc.data().nome}</label>
              <br>
              <span class="material-symbols-outlined">money</span>
              <label class= "user matricula ${doc.data().uid}" style="vertical-align: top;">${doc.data().matricula}</label>
            </div>
            
            <!--Botão-->
            
            <div class="btn-group" role="group" aria-label="Basic example" style="float: right; margin-right: 10px; margin-top: 10px;">
                <button type="button" class="btn btn-primary">-</button>
                <button type="button" class="btn btn-primary">${doc.data().frequencia[frequenciaIndex]}</button>
                <button type="button" class="btn btn-primary">+</button>
            </div>
          </a>`;
      });
      listGroup.innerHTML = items.join('');
    });
    return unsubscribe
}
