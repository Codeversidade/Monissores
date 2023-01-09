const logarComGoogleBtn = document.getElementById('logarComGoogleBtn');
const deslogarDoGoogleBtn = document.getElementById('deslogarDoGoogleBtn');
const configsBtn = document.getElementById('configsBtn');
const addAluno = document.getElementById('addAluno');
const editAluno = document.getElementById('editAluno');
const removeAluno = document.getElementById('removeAluno');
const salvarAlunoBtn = document.getElementById('salvarAlunoNovoBtn');
const editAlunoModalDialog = document.getElementById('editAlunoModalDialog');
const removeAlunoModalDialogBtn = document.querySelector('.deletarTudo');

var desselecionarTudoBtn = document.getElementById('desselecionarTudoBtn');
const editarAlunoBtn = document.getElementById('editarAlunoBtn');
const nomeEditarAlunoInput = document.getElementById('nomeEditarAlunoInput');
const matriculaEditarAlunoInput = document.getElementById(
  'matriculaEditarAlunoInput'
);

const nomeAdicionarAlunoInput = document.getElementById(
  'nomeAdicionarAlunoInput'
);
const matriculaAdicionarAlunoInput = document.getElementById(
  'matriculaAdicionarAlunoInput'
);
const alunosLista1 = document.getElementById('alunosLista1');
const groupListMes = document.querySelectorAll('.list-group');
const searchbarDiv= document.getElementById('searchbar-div');
searchbarDiv.style.cssText = "display: none";
var searchbarCliques = 0;

const nomeApp = document.getElementById("navBarTitulo");
const pesquisarBtn = document.getElementById("pesquisarBtn");
const pesquisarBtn2 = document.getElementById("pesquisarBtn2");
pesquisarBtn2.style.cssText = "display: none;";

const relatorioBtn = document.getElementById("relatorioBtn");
const faixaBtn = document.getElementById("faixaBtn");

const auth = firebase.auth();
const provider = new firebase.auth.GoogleAuthProvider();

var itensSelecionadosListGroup = [];
var listaAlunosChamadaVirtual = [];
var ultimoItemClicado;
var mesChamadaVirtual;
var chamadaVirtualAtivada;

var chamadaVirtualAtivadaServer;
var chamadaVirtualAtivadaClient;

/// Sign in event handlers
function procurarAluno(){
  searchbarCliques++;
  if(searchbarCliques%2 != 0){
    searchbarDiv.style.cssText = "display: inline-block;";
    relatorioBtn.style.cssText = "display: none;";
    configsBtn.style.cssText = "display: none;";
    faixaBtn.style.cssText = "display: none;";
    pesquisarBtn.style.cssText = "display: none;";
    pesquisarBtn2.style.cssText = "display: inline-block;";
    nomeApp.innerHTML = '';
    
    
  }
  else{
    searchbarDiv.style.cssText = "display: none;";
    relatorioBtn.style.cssText = "display: inline-block;";
    configsBtn.style.cssText = "display: inline-block;";
    faixaBtn.style.cssText = "display: inline-block;";
    pesquisarBtn2.style.cssText = "display: none;";
    pesquisarBtn.style.cssText = "display: inline-block;";
    nomeApp.innerHTML = 'Monissor';
  } 

}

function escolherFunc(){
  let groupList = $('.list-group-item');
  var groupListNames = [];
  var groupListMatriculas = [];
  let input = document.getElementById('searchbar').value.toLowerCase();
  
  $('.list-group-item').each(function(){
    groupListNames.push($(this).find('label')[0].innerHTML)
    groupListMatriculas.push($(this).find('label')[1].innerHTML)
  })

  if(!isNaN(input)){
    for(i = 0; i < groupList.length; i++){
      if(!((String)(groupListMatriculas[i]).toLowerCase().includes(input))){
        groupList[i].style.display="none";
      }else{
        groupList[i].style.display="list-item"
      }
    }  
  }else{
    for(i = 0; i < groupList.length; i++){
      if(!(groupListNames[i].toLowerCase().includes(input))){
        groupList[i].style.display="none";
      }else{
        groupList[i].style.display="list-item"
      }
    }
  }
}

logarComGoogleBtn.onclick = () => {
  auth.signInWithPopup(provider);
};

deslogarDoGoogleBtn.onclick = () => {
  auth.signOut();
  unsubscribeLA && unsubscribeLA();
};

const db = firebase.firestore(); //Teste
let alunosRef;
let unsubscribeLA;
let unsubscribeLCV;

auth.onAuthStateChanged(user => {
  if (user) {
    //console.log(firebase)
    // Quando o usuário Logar essa parte será executada
    secaoPrincipal.hidden = false;
    secaoLogin.hidden = true;
    userDetails.innerHTML = `<h3>${user.displayName}!</h3> <p>User ID: ${user.uid}</p>`;
    configsBtn.src = user.photoURL;

    alunosRef = db.collection('alunos');
    chamadaRef = db.collection('chamada');

    /*setarAluno(user, alunosRef, 'Luiz Algusto', 2020123459);
    setarAluno(user, alunosRef, 'Inácio Estácio de Sá', 2020123460);
    setarAluno(user, alunosRef, 'Florisvalda Hortência Tulipa', 2020123463);*/
    salvarAlunoBtn.onclick = () => {
      salvarAluno(
        user,
        alunosRef,
        nomeAdicionarAlunoInput,
        matriculaAdicionarAlunoInput,
        [0, 0, 0, 0]
      );
      //attListGroup();
    };

    removeAlunoModalDialogBtn.onclick = () => {
      configurarBtnRemover(user, alunosRef);
    };
    editarAlunoBtn.onclick = () => {
      configurarBtnEditar(user, alunosRef);
    };
    editAlunoModalDialog.addEventListener('show.bs.modal', event => {
      nomeEditarAlunoInput.value = getNameISLG(itensSelecionadosListGroup[0]);
      matriculaEditarAlunoInput.value = getMatriculaISLG(
        itensSelecionadosListGroup[0]
      );
    });
    chamadaVirtualModalDialog.addEventListener('show.bs.modal', event => {
      chamadaRef
        .doc(`${user.uid}`)
        .get()
        .then(doc => {
          chamadaVirtualAtivadaServer = doc.data().chamadaAtiva;

          var ativar = (chamadaVirtualAtivadaServer) ? 'checked':'';
          if (chamadaVirtualAtivadaServer)
          {
            $('#ativarCVSwitch').addClass('checked');
          }
          divSwitchAtivarChamada.innerHTML = 
          `<label class="form-check-label" for="ativarCVSwitch"
            >Ativar Chamada</label
          >
          <input
            class="form-check-input"
            name="toggleChk"
            type="checkbox"
            role="switch"
            id="ativarCVSwitch"
            ${ativar}
          />`
          configurarSwitchAtivacaoChamadaVirtual(user, chamadaRef)
          //Se estiver ativada no servidor ativa no cliente
          if (chamadaVirtualAtivadaServer) {
            //$('#ativarCVSwitch').trigger('click');
            unsubscribeLCV = exibirListaDeAlunosChamadaVirtual(
              user,
              chamadaRef
            );
          }
        })  
        .catch((error) => {
            chamadaRef
            .doc(`${user.uid}`)
            .set({
              chamadaAtiva: false,
            });
            console.error("É a primeira vez da pessoa na feature, criamos o doc.: ", error);
        });
    });
    chamadaVirtualModalDialog.addEventListener('hide.bs.modal', event => {
      unsubscribeLCV && unsubscribeLCV();
    });
    desselecionarTudoBtn.onclick = () => {
      configurarBtnDesselecionar();
    };
    console.log(removeAlunoModalDialogBtn);
    console.log(editarAlunoBtn);
    configurarSelecaoDosItensListGroup();
    buttonAdicionarFrequencia(user, alunosRef);
    buttonSubtrairFrequencia(user, alunosRef);

    // Pega os dados dos alunos cadastrados no servidor e exibe eles na tela
    exibirListaDeAlunos(user, alunosRef, alunosLista1, 0);
    exibirListaDeAlunos(user, alunosRef, alunosLista2, 1);
    exibirListaDeAlunos(user, alunosRef, alunosLista3, 2);
    unsubscribeLA = exibirListaDeAlunos(user, alunosRef, alunosLista4, 3);
  } else {
    //  Quando o usuário estiver deslogado essa parte será executada
    secaoPrincipal.hidden = true;
    secaoLogin.hidden = false;
    userDetails.innerHTML = '';
  }
});

function setarAluno(user, collectionRef, nome, matricula, frequencia) {
  collectionRef
    .doc(`${user.uid}.A${matricula}`)
    .get()
    .then(doc => {
      let alunoExiste = doc.exists;

      if (!alunoExiste) {
        collectionRef
          .doc(`${user.uid}.A${matricula}`)
          .set({
            uid: user.uid,
            nome: nome,
            matricula: matricula,
            frequencia: frequencia,
          })
          .then(() => {
            if (alunoExiste) console.log('Editamos o aluno.');
            else console.log('Adicionamos o aluno.');
          })
          .catch(e => {
            console.error('Error adding document: ', e);
          });
      } else {
        console.log('Aluno existente');
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

function editarAlunoFrequencia(user, collectionRef, matricula, frequencia) {
  collectionRef
    .doc(`${user.uid}.A${matricula}`)
    .update({
      frequencia: frequencia,
    })
    .then(() => {
      console.log('Editamos o aluno.');
    })
    .catch(error => {
      // Se der erro o documento provavelmente não existe.
      console.error('Error updating document: ', error);
    });
}

function salvarAluno(
  user,
  collectionRef,
  nameInput,
  matriculaInput,
  frequencia
) {
  setarAluno(
    user,
    collectionRef,
    nameInput.value,
    parseInt(matriculaInput.value),
    frequencia
  );
  nameInput.value = '';
  matriculaInput.value = '';
}


function getNameISLG(i) {
  return i.find('label')[0].innerHTML;
}

function getMatriculaISLG(i) {
  return parseInt(i.find('label')[1].innerHTML);
}

function getMesISLG(i) {
  return parseInt(`${i[0].id}`.slice(-1));
}

function removerItemSelecionado(value, index, arr) {
  // If the value at the current array index matches the specified value (2)
  if (getMatriculaISLG(value) === getMatriculaISLG(ultimoItemClicado)) {
    // Removes the value from the original array
    arr.splice(index, 1);
    return true;
  }
  return false;
}

function configurarSelecaoDosItensListGroup() {
  $('.list-group').on('contextmenu', '.list-group-item', function (event) {
    event.preventDefault();
    ultimoItemClicado = $(this);
    var mes = parseInt(`${$(this)[0].id}`.slice(-1));
    //console.log(mes)

    if (this.classList.contains('active')) {
      $(this).removeClass('active');
      itensSelecionadosListGroup.filter(removerItemSelecionado);
    } else {
      $(this).addClass('active'); //.siblings().removeClass('active');
      itensSelecionadosListGroup.push($(this));
    }

    console.log(itensSelecionadosListGroup);
    /*if (itensSelecionadosListGroup.length != 0) {
      console.log(getNameISLG(itensSelecionadosListGroup[0]));
      console.log(getMatriculaISLG(itensSelecionadosListGroup[0]));
      console.log(getMesISLG(itensSelecionadosListGroup[0]));
    }*/
    mudarEstadosDaInterfaceNaSelecao(itensSelecionadosListGroup.length, mes);
  });
}

function buttonAdicionarFrequencia(user, alunosRef) {
  $('.list-group').on('click', '.ba', function (event) {
    event.preventDefault();
    var matricula = parseInt(`${$(this)[0].id}`.slice(0));
    var mes = parseInt(`${$(this)[0].id}`.slice(-1));
    var valorFrec = parseInt(`${$(this)[0].value}`);
    attFrequencia(user, alunosRef, matricula, mes, parseInt(valorFrec + 1));
  });
}

function buttonSubtrairFrequencia(user, alunosRef) {
  $('.list-group').on('click', '.bd', function (event) {
    event.preventDefault();
    var matricula = parseInt(`${$(this)[0].id}`.slice(0));
    var mes = parseInt(`${$(this)[0].id}`.slice(-1));
    var valorFrec = parseInt(`${$(this)[0].value}`);
    if (valorFrec > 0) {
      attFrequencia(user, alunosRef, matricula, mes, parseInt(valorFrec - 1));
    }
  });
}

function mudarEstadosDaInterfaceNaSelecao(n, index) {
  if (n == 0) {
    navBarTitulo.innerHTML = 'Relatório Monitoria';
    ativacao = true;
  } else if (n == 1) {
    navBarTitulo.innerHTML = `${n} item selecionado`;
    ativacao = false;
  }

  var buttonsPadrão = document.querySelectorAll('.buttonsPadrão');
  var buttonsExtra = document.querySelectorAll('.buttonsExtra');
  var buttonsAbas = document.querySelectorAll('.linhaAbas');

  for (b = 0; b < buttonsPadrão.length; b++) {
    buttonsPadrão[b].hidden = !ativacao;
  }
  for (b = 0; b < buttonsExtra.length; b++) {
    buttonsExtra[b].hidden = ativacao;
  }
  for (b = 0; b < buttonsAbas.length; b++) {
    buttonsAbas[b].hidden = !ativacao;
    buttonsAbas[index].hidden = false;
  }
  addAluno.hidden = !ativacao;
  if (n > 1) {
    buttonsExtra[1].hidden = !ativacao;
    navBarTitulo.innerHTML = `${n} itens selecionados`;
  }
}

function configurarBtnRemover(user, alunosRef) {
  itensSelecionadosListGroup.forEach(i => {
    removerAluno(user, alunosRef, getMatriculaISLG(i));
  });
  itensSelecionadosListGroup = [];
  mudarEstadosDaInterfaceNaSelecao(0, 0);
}

function configurarBtnDesselecionar() {
  ultimoItemClicado.siblings().removeClass('active');
  ultimoItemClicado.removeClass('active');
  mudarEstadosDaInterfaceNaSelecao(0, getMesISLG(ultimoItemClicado));
  itensSelecionadosListGroup = [];
  
}

function configurarBtnEditar(user, alunosRef) {
  alunosRef
    .doc(`${user.uid}.A${getMatriculaISLG(itensSelecionadosListGroup[0])}`)
    .get()
    .then(doc => {
      console.log(doc.data().frequencia);
      setarAluno(
        user,
        alunosRef,
        nomeEditarAlunoInput.value,
        parseInt(matriculaEditarAlunoInput.value),
        doc.data().frequencia
      );
      removerAluno(
        user,
        alunosRef,
        getMatriculaISLG(itensSelecionadosListGroup[0])
      );
      itensSelecionadosListGroup = [];
      mudarEstadosDaInterfaceNaSelecao(0, 0);
    });
}

function configurarSwitchAtivacaoChamadaVirtual(user, collectionRef) {
  $('#ativarCVSwitch').change(function (event) {
    chamadaVirtualAtivadaClient = $(this).is(':checked');
    mesChamadaVirtual = 0;
    console.log("Client: " + chamadaVirtualAtivadaClient)
    console.log("Server: " + chamadaVirtualAtivadaServer)
    console.log("Event" + event.type)
    chamadaRef
      .doc(`${user.uid}`)
      .get()
      .then(doc => {
        chamadaVirtualAtivadaServer = doc.data().chamadaAtiva;

        if (
          chamadaVirtualAtivadaClient == true &&
          chamadaVirtualAtivadaServer == false
        ) {
          collectionRef
            .doc(`${user.uid}`)
            .set({
              chamadaAtiva: chamadaVirtualAtivadaClient,
              mes: mesChamadaVirtual,
            })
            .then(() => {
              console.log(
                `Chamada ativada agora já pode compartilhar o link. http://localhost:5005/?code=${user.uid}`
              );
              unsubscribeLCV = exibirListaDeAlunosChamadaVirtual(
                user,
                chamadaRef
              );
            })
            .catch(e => {
              console.error('Error adding document: ', e);
            });
        } else if (
          chamadaVirtualAtivadaClient == false &&
          chamadaVirtualAtivadaServer == true
        ) {
          chamadaRef
            .doc(`${user.uid}`)
            .set({
              chamadaAtiva: chamadaVirtualAtivadaClient,
            })
            .then(() => {
              console.log(
                `'Chamada fechada é hora de importar os alunos e mudar o estado da interface.'`
              );
              importarAlunosChamadaVirtual(user, alunosRef, chamadaRef);
              // TODO usar a função editar para editar a chamada só que sem o problema de deletar o aluno para adicionar de novo, provavelmente tme que usar o merge
            })
            .catch(e => {
              console.error('Error adding document: ', e);
            });
        }
      });
    /*collectionRef
        .doc(`${searchParams.get('code')}`)
        .get().then((doc) => {
            var chamadaAtiva = doc.data().*/

    /*.get().then((doc) => {
            var chamadaAtiva = doc.data().chamadaAtiva


            .set
            ({
                chamadaAtiva: ativou,
                mes: mesChamadaVirtual
            }).catch((e) =>{
                console.error("Error adding document: ", e);
            })
    
    chamadaVirtualAtivada =   */
  });
}

function importarAlunosChamadaVirtual(user, alunosRef, chamadaRef) {
  listaAlunosChamadaVirtual.forEach(element => {
    alunosRef
      .doc(`${user.uid}.A${element.matricula}`)
      .get()
      .then(doc => {
        var frequencia = doc.data().frequencia;
        frequencia[mesChamadaVirtual] = frequencia[mesChamadaVirtual] + 1;
        editarAlunoFrequencia(user, alunosRef, element.matricula, frequencia);
        console.log("O aluno teve a matrícula atualizada.")
      })
      .catch((error) => {
          // The document probably doesn't exist.
          var frequencia = [0, 0, 0, 0];
          frequencia[mesChamadaVirtual] = 1;
          setarAluno(user, alunosRef, element.nome, element.matricula, frequencia)
          console.error("O aluno n existia, adicionamos. Error updating document: ", error);
      });

      removerAluno(user, chamadaRef, element.matricula)
  });
  listaAlunosChamadaVirtual = [];
}

function exibirListaDeAlunos(user, collectionRef, listGroup, frequenciaIndex) {
  let unsubscribe = collectionRef
    .where('uid', '==', user.uid)
    .onSnapshot(querySnapshot => {
      const items = querySnapshot.docs.map(doc => {
        return `<a href="#" id="${doc.data().matricula}-${frequenciaIndex}"  
        class="list-group-item list-group-item-action flex-column align-items-start">
            <!--Dados aluno-->
            <div style="float: left; margin-left: 10px;">
              <span class="material-symbols-outlined">person</span>
              <label " class= "user name ${
                doc.data().matricula
              }" style="vertical-align: top; max-width: 350px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${
          doc.data().nome
        }</label>
              <br>
              <span class="material-symbols-outlined">money</span>
              <label class= "user matricula ${
                doc.data().uid
              }" style="vertical-align: top;">${doc.data().matricula}</label>
            </div>
            
            <!--Botão-->
            
            <div class="btn-group" role="group" aria-label="Basic example" style="float: right; margin-right: 10px; margin-top: 10px;">
                <button type="button" id="${
                  doc.data().matricula
                }-BD${frequenciaIndex}" value="${
          doc.data().frequencia[frequenciaIndex]
        }" class="btn btn-primary bd">-</button>
                <button type="button" class="btn btn-primary">${
                  doc.data().frequencia[frequenciaIndex]
                }</button>
                <button type="button" id="${
                  doc.data().matricula
                }-BA${frequenciaIndex}" value="${
          doc.data().frequencia[frequenciaIndex]
        }" class="btn btn-primary ba">+</button>
            </div>
          </a>`;
      });
      listGroup.innerHTML = items.join('');
    });
  return unsubscribe;
}

function exibirListaDeAlunosChamadaVirtual(user, collectionRef) {
  let unsubscribe = collectionRef
    .where('code', '==', user.uid)
    .onSnapshot(querySnapshot => {
      const items = querySnapshot.docs.map(doc => {
        listaAlunosChamadaVirtual.push(doc.data()) 
        return `<li>${doc.data().nome} \(${doc.data().matricula}\)</li>`;
      });
      totalAlunosChamadaVirtual.innerHTML = querySnapshot.docs.length;
      alunosListaChamadaVirtual.innerHTML = items.join('');
    });
  return unsubscribe;
}

function attFrequencia(user, alunosRef, matricula, mes, valorFrec) {
  alunosRef
    .doc(`${user.uid}.A${matricula}`)
    .get()
    .then(doc => {
      var frequencia = doc.data().frequencia;
      frequencia[mes] = valorFrec;
      editarAlunoFrequencia(user, alunosRef, matricula, frequencia);
    });
}
