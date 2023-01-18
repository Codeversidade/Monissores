const deslogarDoGoogleBtn = document.getElementById('deslogarDoGoogleBtn');
const configsBtn = document.getElementById('configsBtn');
const addAluno = document.getElementById('addAluno');
const editAluno = document.getElementById('editAluno');
const removeAluno = document.getElementById('removeAluno');
const salvarAlunoBtn = document.getElementById('salvarAlunoNovoBtn');

const removeAlunoModalDialogBtn = document.querySelector('.deletarTudo');

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
  
  var searchbarCliques = 0;
  
  const nomeApp = document.getElementById("navBarTitulo");
  const cabecalhoInterno1 = document.getElementById("cabecalhoInterno1");
  const barraDePesquisa = document.getElementById("barraDePesquisa");
  const pesquisarBtn = document.getElementById("pesquisarBtn");
  const searchbarBtnComeBack = document.getElementById("searchbarBtnComeBack");
  barraDePesquisa.style.cssText = "display: none;";
  
const relatorioBtn = document.getElementById("relatorioBtn");
const faixaBtn = document.getElementById("faixaBtn");

const auth = firebase.auth();

var itensSelecionadosListGroup = [];
var listaAlunosChamadaVirtual = [];
var ultimoItemClicado;
var mesChamadaVirtual = 0;
var mesChamadaVirtualServer = 0;
var chamadaVirtualAtivada;

var chamadaVirtualAtivadaServer = false;
var chamadaVirtualAtivadaClient;
var qrCode;
var tabAtual = $("#mes-1-tab")[0];
var online = true;

deslogarDoGoogleBtn.onclick = () => {
  auth.signOut();
  unsubscribeLA && unsubscribeLA();
  unsubscribeEstadoCV && unsubscribeEstadoCV();

};

const db = firebase.firestore(); //Teste

//firebase.enableIndexDbPersistence(db);

firebase.firestore().enablePersistence()
.catch((err) => {
  if (err.code == 'failed-precondition') {
    // Multiple tabs open, persistence can only be enabled
    // in one tab at a a time.
        // ...
    } else if (err.code == 'unimplemented') {
        // The current browser does not support all of the
        // features required to enable persistence
        // ...
      }
});
let alunosRef;
let unsubscribeLA;
let unsubscribeLCV;
let unsubscribeEstadoCV;

auth.onAuthStateChanged(user => {
  if (user) {
    //console.log(firebase)
    // Quando o usuário Logar essa parte será executada
    secaoPrincipal.hidden = false;
    secaoLogin.hidden = true;
    secaoInicial.hidden = true;
    userDetails.innerHTML = `<h3>${user.displayName}!</h3> <p>User ID: ${user.uid}</p>`;
    

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

    // ARMENGE
    /*setarAluno(
      user,
      alunosRef,
      "Me delete",
      1111,
      [0, 0, 0, 0]
    );*/
    removeAlunoModalDialogBtn.onclick = () => {
      configurarBtnRemover(user, alunosRef);
    };
    editarAlunoBtn.onclick = () => {
      configurarBtnEditar(user, alunosRef);
    };
    
    $('#btnCompartilharLinkChamadaVirtual').on('click', () => compartilharLinkChamadaVirtual())
    addAlunoModalDialog.addEventListener('show.bs.modal', event => 
        configurarDialogPushState("dialog", "addAlunoModalDialog", "adicionar")
    );
    relatorioModalDialog.addEventListener('show.bs.modal', event => 
        configurarDialogPushState("dialog", "relatorioModalDialog", "relatorio")
    );
    configsModalDialog.addEventListener('show.bs.modal', event => 
        configurarDialogPushState("dialog", "configsModalDialog", "configs")
    );
    
    removeAlunoModalDialog.addEventListener('show.bs.modal', event => {
        configurarDialogPushState("dialog", "removeAlunoModalDialog", "remover", "selecao");
    });
  
    editAlunoModalDialog.addEventListener('show.bs.modal', event => {
      configurarDialogPushState("dialog", "editAlunoModalDialog", "editar", "selecao")
      nomeEditarAlunoInput.value = getNameISLG(itensSelecionadosListGroup[0]);
      matriculaEditarAlunoInput.value = getMatriculaISLG(
        itensSelecionadosListGroup[0]
      );
    });

    chamadaVirtualModalDialog.addEventListener('show.bs.modal', event => {
      configurarDialogPushState("dialog", "chamadaVirtualModalDialog", "chamada_virtual")
      chamadaRef
        .doc(`${user.uid}`)
        .get({source: 'cache'})
        .then(doc => {
          //chamadaVirtualAtivadaServer = doc.data().chamadaAtiva;
          //1atualizarLayoutDialogCV(user.uid)
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
    var dialogs = [
      removeAlunoModalDialog,
      editAlunoModalDialog,
      addAlunoModalDialog,
      relatorioModalDialog,
      configsModalDialog];
    configurarDialogPopState(dialogs);
    window.addEventListener('online', () => {
      online = true;
      atualizarTextoBtnCV(user.uid, tabAtual);
      //$('ativarCVSwitch').addClass('checked');
      //atualizarLayoutDialogCV(user.uid);
    });
    window.addEventListener('offline', () => {
        online = false;
        atualizarTextoBtnCV(user.uid, tabAtual);
        //atualizarLayoutDialogCV(user.uid);
    });
    chamadaVirtualModalDialog.addEventListener('hide.bs.modal', event => {
      if (history.state.id == 'dialog')
      {
          history.go(-1)
      }
      unsubscribeLCV && unsubscribeLCV();
    });
    
    configurarBtnDesselecionar();
    desgrudar()
    console.log(removeAlunoModalDialogBtn);
    console.log(editarAlunoBtn);
    configurarSelecaoInicialDosItensListGroup();
    configurarSelecaoDosItensListGroupClick();
    buttonAdicionarFrequencia(user, alunosRef);
    buttonSubtrairFrequencia(user, alunosRef);
    configuraBtnMes(user, alunosRef);
    configurarPopState()
    configurarTitlyMonissor()
    configurarTabsPushState()

    // Atualiza o Estado da chamada virtual
    unsubscribeEstadoCV = monitorarEstadoChamadaVirtual(user, chamadaRef);
    // Pega os dados dos alunos cadastrados no servidor e exibe eles na tela
    exibirListaDeAlunos(user, alunosRef, alunosLista1, 0);
    exibirListaDeAlunos(user, alunosRef, alunosLista2, 1);
    exibirListaDeAlunos(user, alunosRef, alunosLista3, 2);
    unsubscribeLA = exibirListaDeAlunos(user, alunosRef, alunosLista4, 3);
  } else {
    //  Quando o usuário estiver deslogado essa parte será executada
    secaoPrincipal.hidden = true;
    secaoInicial.hidden = true;
    secaoLogin.hidden = false;
    userDetails.innerHTML = '';
  }
});

/*var connectedRef = firebase.database().ref(".info/connected");
connectedRef.on("value", (snap) => {
  if (snap.val() === true) {
      
  } else {
      
      console.log("Net Caiu :(")
  }
});
var firebaseRef = new Firebase('http://INSTANCE.firebaseio.com');
firebaseRef.child('.info/connected').on('value', function(connectedSnap) {
  if (connectedSnap.val() === true) {
    /* we're connected! 
  } else {
    console.log("Vish, net caiu")
  }
});*/


///////////////////////////////////////////
//Impedindo que a lista de alunos fique debaixo do cabeçalho lá no html
window.addEventListener('resize',desgrudar);
function desgrudar(){
  var alturaCabecalho = document.getElementById("cabecalho").offsetHeight
  var divConteudo = document.getElementById('linhaAbasContent')
  divConteudo.style.marginTop = alturaCabecalho + "px";
}
//////////////////////////////////////////////

function setarAluno(user, collectionRef, nome, matricula, frequencia) {
  collectionRef
    .doc(`${user.uid}.A${matricula}`)
    .get({source: 'cache'})
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
            else console.log('Adicionamos o aluno offline.');
          })
          .catch(e => {
            console.error('Error adding document: ', e);
          });
    });
}

function removerAluno(user, collectionRef, matricula, tarefa = () => {}) {
  collectionRef
    .doc(`${user.uid}.A${matricula}`)
    .delete()
    .then(() => {
      console.log(`Deletamos aluno A${matricula}`);
      tarefa();
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

function getMesTabAtual(tab_atual) {
  return parseInt(tab_atual.id.slice(4, 5)) -1;
}


function getDivBunttonsFrequenciaISLG(i) {
  return i.find('div')[1];
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

function configurarSelecaoInicialDosItensListGroup() {
  $('.list-group').on('contextmenu', '.list-group-item', function (event) {
    event.preventDefault();
    ultimoItemClicado = $(this);
    var mes = parseInt(`${$(this)[0].id}`.slice(-1));
    //console.log(mes)

    if (this.classList.contains('active')) {
      $(this).removeClass('active');
      itensSelecionadosListGroup.filter(removerItemSelecionado);
      $(this).find('div')[1].style.display=null;
    } else {
      $(this).addClass('active'); //.siblings().removeClass('active');
      itensSelecionadosListGroup.push($(this));
      $(this).find('div')[1].style.display="none";
      
      if (itensSelecionadosListGroup.length == 1 && (history.state.id == null || history.state.id == 'tabs'))
      {   
          console.log("O estado é")
          console.log(history.state)
          history.pushState({id:"selecao", lgi_id: $(this).attr('id')}, "selecao", "?selecao")
          console.log("PUSH de Seleção")
      }
    }

    /*if (itensSelecionadosListGroup.length != 0) {
      console.log(getNameISLG(itensSelecionadosListGroup[0]));
      console.log(getMatriculaISLG(itensSelecionadosListGroup[0]));
      console.log(getMesISLG(itensSelecionadosListGroup[0]));
    }*/
    //configurarBtnComeBack()
    returnBackPagDesign()
    mudarEstadosDaInterfaceNaSelecao(itensSelecionadosListGroup.length, mes);
  });
}

function configurarSelecaoDosItensListGroupClick() {
  $('.list-group').on('click', '.list-group-item', function (event) {
    event.preventDefault();
    ultimoItemClicado = $(this);
    var mes = parseInt(`${$(this)[0].id}`.slice(-1));
    //console.log(mes)

    if (this.classList.contains('active')) {
      $(this).removeClass('active');
      itensSelecionadosListGroup.filter(removerItemSelecionado);
      $(this).find('div')[1].style.display=null;
    } else if (itensSelecionadosListGroup.length != 0) {

      $(this).addClass('active'); //.siblings().removeClass('active');
      itensSelecionadosListGroup.push($(this));
      $(this).find('div')[1].style.display="none";
    }

    /*if (itensSelecionadosListGroup.length != 0) {
      console.log(getNameISLG(itensSelecionadosListGroup[0]));
      console.log(getMatriculaISLG(itensSelecionadosListGroup[0]));
      console.log(getMesISLG(itensSelecionadosListGroup[0]));
    }*/
    //configurarBtnComeBack()
    returnBackPagDesign()
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

function compartilharLinkChamadaVirtual() {
    if (navigator.canShare) {
        navigator.share(
          {
              title: 'Link Chamada Virtual',
              text: `Responda a chamada virtual.\n${inputLinkChamadaVirtual.value}`
          }
        )
    }
}

function atualizarLayoutDialogCV(code) {

  console.log("Eu sou a func q dá problema")
  //var ativar = (chamadaVirtualAtivadaServer) ? 'checked':'';

  if (chamadaVirtualAtivadaServer == true)
  {
      $('#ativarCVSwitch').prop('checked', true);
  }
  else
  {
      $('#ativarCVSwitch').prop('checked', false);
  }
  if (online == true)
  {
    $('#ativarCVSwitch').prop('disabled', false);
  }
  else
  {
      $('#ativarCVSwitch').prop('disabled', true);
  }

  if (online == false)
  {
    secaoChamadaAtivada.hidden = true;
    secaoChamadaDesativada.hidden = true;
    secaoChamadaOffline.hidden = false;
  }
  else if (chamadaVirtualAtivadaServer)
  {
    //$('#ativarCVSwitch').addClass('checked');
    $('#chamadaVirtualDialogTitle').html(`Chamada Virtual do ${mesChamadaVirtualServer + 1}º Mês`);
    secaoChamadaAtivada.hidden = false;
    secaoChamadaDesativada.hidden = true;
    secaoChamadaOffline.hidden = true;
    
    inputLinkChamadaVirtual.value = (window.location.hostname == 'localhost') ? `http://localhost:5005/?code=${code}` : `http://monissores-chamada.web.app/?code=${code}`
    //new QRCode(document.getElementById("qrcode"), inputLinkChamadaVirtual.value);
    
    if (qrCode == null)
    {
      qrCode = new QRCode(document.getElementById("qrcode"), {
        text: inputLinkChamadaVirtual.value,
        width: 128,
        height: 128,
        colorDark : "#000000",
        colorLight : "#ffffff",
        correctLevel : QRCode.CorrectLevel.H,
      });
    }
  }
  else
  {
    $('#chamadaVirtualDialogTitle').html(`Chamada Virtual do ${tabAtual.innerHTML}`);
    secaoChamadaAtivada.hidden = true;
    secaoChamadaDesativada.hidden = false;
    secaoChamadaOffline.hidden = true;
  }
  /*divSwitchAtivarChamada.innerHTML = 
  `<table style="width: -webkit-fill-available;">
      <tr>
        <td>
          <label class="form-check-label" for="ativarCVSwitch" style="text-align: left;">
            <strong>Ativar Chamada Virtual</strong>
          </label>
        </td>
          
        <td>
          <input
            class="form-check-input"
            name="toggleChk"
            type="checkbox"
            role="switch"
            style="text-align: left;"
            id="ativarCVSwitch"
            ${ativar}
            ${desabilitar}
            />
          
        </td>
      </tr>
    </table>`
    ativarCVSwitch()*/
}

function atualizarTextoBtnCV(code, tabAtual = null) {
  console.log("A funcao TextoBTNCV foi chamada")
  console.log(chamadaVirtualAtivadaServer)
  if (online && chamadaVirtualAtivadaServer == false) {
    $('#chamadaVirtual').removeClass("Ativada");
    $('#chamadaVirtual').html(
      `<table>
      <tr>
      <th rowspan="2"><span class="material-symbols-outlined">add_link</span></th>
      <td><strong>Chamada Virtual do </strong><strong id="chamadaVirtualMesText">1º Mês</strong></td>
      </tr>
      <tr>
      <td >Estado: Desativada</td>
      </tr>
      </table>`
      );
      $('#chamadaVirtualMesText').html(tabAtual == null ? "1º Mês" : tabAtual.innerHTML);
  }
  else if (online && chamadaVirtualAtivadaServer == true) {
    $('#chamadaVirtual').addClass("Ativada");
    console.log("A chamada btn")
    console.log($('#chamadaVirtual')[0])
    $('#chamadaVirtual').html(
      `<table>
      <tr>
          <th rowspan="2"><span class="material-symbols-outlined">link</span></th>
          <td><strong>Chamada Virtual do </strong><strong id="chamadaVirtualMesText">${mesChamadaVirtualServer+1}º Mês</strong></td>
        </tr>
        <tr>
          <td >Estado: Ativada</td>
        </tr>
        </table>`
      );
    }
  else {
    $('#chamadaVirtual').removeClass("Ativada");
    $('#chamadaVirtual').html(
      `<table>
      <tr>
      <th rowspan="2"><span class="material-symbols-outlined">cloud_off</span></th>
      <td><strong>Offline</strong></td>
      </tr>
      <tr>
      <td >Conecte-se com a internet para habilitar a Chamada Virtual</td>
      </tr>
      </table>`
      );
      
    }
    if (code)
    {
        atualizarLayoutDialogCV(code);
    }
}

function mudarEstadosDaInterfaceNaSelecao(n, index) {
  var buttonsPadrão = document.querySelectorAll('.buttonsPadrão');
  var buttonsExtra = document.querySelectorAll('.buttonsExtra');
  var buttonsAbas = document.querySelectorAll('.linhaAbas');
  var buttonsDiminuir = document.querySelectorAll('.bd');
  var buttonsAumentar = document.querySelectorAll('.ba');
  var buttonsFrequencia = document.querySelectorAll('.bf');

  if (n == 0) {
    //Caso barra de pesquisa esteja preechida
    if(document.getElementById('searchbar').value != ""){
      escolherFunc()
      configurarBtnToShearch();
    }else{
      navBarTitulo.innerHTML = 'Monissores';
    }
    ativacao = true;
  } else if (n == 1) {
    navBarTitulo.innerHTML = `${n} item selecionado`;
    ativacao = false;
  } 
  
  //mostra de volta a parte de frequencia
  //for(i = 0; i <= n; i++){getDivISLG(itensSelecionadosListGroup[i+1]).style.display=null}
  
  for (b = 0; b < buttonsPadrão.length; b++) {
    buttonsPadrão[b].hidden = !ativacao;
  }
  for (b = 0; b < buttonsAumentar.length; b++) {
    buttonsAumentar[b].disabled = !ativacao;
    buttonsDiminuir[b].disabled = !ativacao;
    buttonsFrequencia[b].disabled = !ativacao;
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

  if (itensSelecionadosListGroup.length == 0 && history.state.id == 'selecao')
  {
      history.go(-1);
  }
}

function configurarDialogPushState(id, dialog_id, url) {
    if ((history.state.id == null || history.state.id == 'tabs' || history.state.id == 'selecao'))
    {
        history.pushState({id:id, dialog_id: dialog_id}, dialog_id, `?${url}`);
    }
}

function configurarTabsPushState() {
  //$()'show.bs.modal'
  //tab-pane  
  console.log("FuncFunciona")
  $('.nav').on('shown.bs.tab', function(event){
    tabAtual = $(event.target)[0];       // active tab
    var y = $(event.relatedTarget).text();  // previous tab
    console.log(tabAtual.id)
    
    // Mudar texto do btn chamada virtual
    // Criar um pushState
    console.log(history.length)
    //if (history.state.id == null && tabAtual.id)
    if (history.state.tab_id != tabAtual.id)
    {
      if (!(history.state.id == null && tabAtual.id == "mes-1-tab"))
      {
        history.pushState({id:"tabs", tab_id: tabAtual.id}, tabAtual.innerHTML, `?${tabAtual.id}`);
      }
    }
    
    atualizarTextoBtnCV(null, tabAtual);
  });
  /*if (history.state.id == state)
  {
      history.pushState({id:id, dialog_id: dialog_id}, dialog_id, `?${url}`);
  }*/
}

function configurarDialogPopState(dialogs) {
  dialogs.forEach(dialog => {
        dialog.addEventListener('hide.bs.modal', event => {
            if (dialog.id == 'removeAlunoModalDialog' && history.state.id == 'dialog')
            {
                history.go(-1);
            }
            else if (history.state.id == 'dialog')
            {
                history.go(-1)
            }
            
      });
  });
  
}

function configurarPopState() {
    history.replaceState({id: null}, "Default state", "./");
    window.addEventListener('popstate', e => {
        if (e.state.id == null)
        {
            console.log(" VOlttei pro inicio")
            history.replaceState({id: null}, "Default state", "./");
            configurarBtnComeBack()
            if (itensSelecionadosListGroup.length > 0)
                $("#desselecionarTudoBtn").trigger("click");
            closeAllDialogs()
            $(`#mes-1-tab`).trigger("click");

        }
        else if (e.state.id == 'pesquisa')
        {
            console.log("Quando clica pra frente " + e.state.id)
            startSearchByID()
            
        }
        else if (e.state.id == 'selecao')
        {   
            console.log("Quando clica pra frente na selecao" + e.state.id)
            closeAllDialogs()
            startSelectionByID(e.state);
        }
        else if (e.state.id == 'dialog')
        {   
            console.log("Quando clica pra frente na selecao" + e.state.id);
            openDialogByID(e.state);
        }
        else if (e.state.id == 'tabs')
        {   
            console.log("Voltou uma aba aeum" + e.state.id);
            closeAllDialogs();
            configurarBtnComeBack();
            if (itensSelecionadosListGroup.length > 0)
            {
                $("#desselecionarTudoBtn").trigger("click");

            }
                console.log("É pra desselecionar")
            openTabByID(e.state);
        }
        else
        {
            console.log("Clicou no botão de voltar")
            console.log(e.state)
            console.log(e.state.id == 'tabs')
            //startSearchByID(e.state.id)
            /*configurarBtnComeBack(e.state.id);
            configurarBtnDesselecionar(e.state.id);*/
        }
    });

    
}

function startSearchByID() {
    configurarBtnToShearch();
}

function startSelectionByID(state) {
    if (itensSelecionadosListGroup.length == 0)
    {
        console.log("O item selecionado foi")
        console.log($(`#${state.lgi_id}`)[0])

        $(`#${state.lgi_id}`).trigger("contextmenu");

        if ($(`#${state.lgi_id}`)[0] == null)
        {
          
          console.log("EBA")
          selecionarPrimeiroItemDaTabAtual()
        }
    }
}

function openDialogByID(state) {
    //$(`#${state.btn_id}`).trigger("click");
    // Aqui eu tem que mostrar a tela inicial tab 0
    $(`#${state.dialog_id}`).modal('show');
}

function openTabByID(state) {
  console.log("Bora abrir a aba")
    //$(`#${state.btn_id}`).trigger("click");
    $(`#${state.tab_id}`).trigger("click");
}

function closeAllDialogs() {
    var dialogs = ["chamadaVirtualModalDialog",
    "removeAlunoModalDialog",
    "editAlunoModalDialog",
    "addAlunoModalDialog",
    "relatorioModalDialog",
    "configsModalDialog"]

    dialogs.forEach(element => {
        $(`#${element}`).modal('hide');
    });
}


function configurarBtnRemover(user, alunosRef) {
  itensSelecionadosListGroup.forEach(i => {
    removerAluno(user, alunosRef, getMatriculaISLG(i), () => {
      //$("#desselecionarTudoBtn").trigger("click");
      //go(-1)
      //history.replaceState({id:"pesquisa"}, "pesquisa", "?pesquisa")
      //history.pushState({id:"pesquisa"}, "pesquisa", "?pesquisa")
      //go(-1)
      $("#desselecionarTudoBtn").trigger("click");
    });
  });
  itensSelecionadosListGroup = [];
  mudarEstadosDaInterfaceNaSelecao(0, 0);
}

function configurarBtnDesselecionar() {
  $("#desselecionarTudoBtn").on("click", function (event) {
    event.preventDefault();
    ultimoItemClicado.siblings().removeClass('active');
    ultimoItemClicado.removeClass('active');
    mudarEstadosDaInterfaceNaSelecao(0, getMesISLG(ultimoItemClicado));
    //Exibi novamente inteface da frequencia do items selecionados
    for(i = 0; i < itensSelecionadosListGroup.length; i++){
      getDivBunttonsFrequenciaISLG(itensSelecionadosListGroup[i]).style.display=null
    }
    itensSelecionadosListGroup = [];
    escolherFunc();

    if (history.state.id == 'selecao')
    {
        history.go(-1);
    }
  });
}

function configurarBtnEditar(user, collectionRef) {
  var matricula_velha = getMatriculaISLG(itensSelecionadosListGroup[0]);
  var matricula_nova = parseInt(matriculaEditarAlunoInput.value)

  if (matricula_velha == matricula_nova)
  {
      collectionRef
      .doc(`${user.uid}.A${matricula_velha}`)
      .update({
        nome: nomeEditarAlunoInput.value,
      })
      .then(() => {
        console.log('Editamos o aluno com o update.');
        $("#desselecionarTudoBtn").trigger("click");
      })
      .catch(error => {
        // Se der erro o documento provavelmente não existe.
        console.error('Error updating document: ', error);
      });
  }
  else
  {
    collectionRef
    .doc(`${user.uid}.A${matricula_velha}`)
    .get({source: 'cache'})
    .then(doc => {
      var freq = doc.data().frequencia;
      console.log(freq);
      setarAluno(
        user,
        collectionRef,
        nomeEditarAlunoInput.value,
        matricula_nova,
        freq
      )
      removerAluno(
        user,
        collectionRef,
        matricula_velha, () => {
        $("#desselecionarTudoBtn").trigger("click");
        history.replaceState({id:"selecao", lgi_id: `${matricula_nova}-${getMesISLG(ultimoItemClicado)}`}, "selecao", "?selecao");
        });
      itensSelecionadosListGroup = [];
      mudarEstadosDaInterfaceNaSelecao(0, 0);
    });
  }
}
//Facilitando botão de Pesquisa
////////////////////////////////////////
function configurarBtnToShearch(){
  cabecalhoInterno1.style.cssText = "display: none;";
  barraDePesquisa.style.cssText = "display: block;";
  document.getElementById("searchbar").focus();
  //console.log("teste")

  if ((history.state.id == null || history.state.id == 'tabs'))
  {
      history.pushState({id:"pesquisa"}, "pesquisa", "?pesquisa")
      console.log("PUSH de Pesquisar")
  }
  desgrudar()
}

function configurarBtnComeBack(){
  cabecalhoInterno1.style.cssText = "display: flex;";
  barraDePesquisa.style.cssText = "display: none;"
  document.getElementById('searchbar').value = null;
  mudarEstadosDaInterfaceNaSelecao(0, 0);
  escolherFunc()

  if (history.state.id == 'pesquisa')
  {
      history.go(-1);
  }
  desgrudar()
}

function returnBackPagDesign(){
  cabecalhoInterno1.style.cssText = "display: flex;";
  barraDePesquisa.style.cssText = "display: none;"
}

////////////////////////////////////////////////

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
        groupList[i].style.display="list-item";
      }
    }
  }
}

function selecionarPrimeiroItemDaTabAtual() {
      var primeiroItem = $('.list-group-item')[0].id;
      var matricula = parseInt(primeiroItem.slice(0, primeiroItem.indexOf("-")));
      var mes = (tabAtual.id == null) ? 0 : getMesTabAtual(tabAtual);
      console.log(mes)
      $(`#${matricula}-${mes}`).trigger("contextmenu");
}

function configuraBtnMes(user, collectionRef){
  $('.dropdown').on('click', '.dropdown-item', function (event) {
    event.preventDefault();
    configurarBtnRelatorio(user, collectionRef, (parseInt($(this).html().slice(-1)) - 1))
    //console.log(parseInt($(this).html().slice(-1)));
  })
}

function configurarBtnRelatorio(user, collectionRef, frequenciaIndex){
  let unsubscribe = collectionRef
    .where('uid', '==', user.uid)
    .onSnapshot({ includeMetadataChanges: true }, querySnapshot => {
      const items = querySnapshot.docs.map(doc => {
        var freq = doc.data().frequencia[frequenciaIndex];
        return `${doc.data().nome}/${doc.data().matricula}/${freq} ${(freq == 1) ? 'vez': 'vezes'};<br>`;
      });
      listaAlunosRelatorio.innerHTML = items.join('');
      //console.log(listaAlunosRelatorio.innerHTML)
    });
}

function copyButton(){
  //console.log($("#listaAlunosRelatorio").text());
  navigator.clipboard.writeText($("#listaAlunosRelatorio").text())
  
  const toast = new bootstrap.Toast(document.getElementById('toastRelatorioCopiado'))
  toast.show()
}

function configurarSwitchAtivacaoChamadaVirtual(user, collectionRef) {
  $('#ativarCVSwitch').change(function (event) {
    console.log("Switcheeeee")
    chamadaVirtualAtivadaClient = $(this).is(':checked');
    mesChamadaVirtual = getMesTabAtual(tabAtual);
    console.log("Client: " + chamadaVirtualAtivadaClient)
    console.log("Server: " + chamadaVirtualAtivadaServer)
    //console.log("Event" + event.type)
    
    //chamadaVirtualAtivadaServer //doc.data().chamadaAtiva;
        
    if (
      chamadaVirtualAtivadaClient == true &&
      chamadaVirtualAtivadaServer == false
    ) {
      collectionRef
        .doc(`${user.uid}`)
        .set({
          chamadaAtiva: chamadaVirtualAtivadaClient,
          mes: mesChamadaVirtual,
          uid: user.uid,
        })
        .then(() => {
          //1atualizarLayoutDialogCV(user.uid)
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
          uid: user.uid,
        })
        .then(() => {
          console.log(
            `'Chamada fechada é hora de importar os alunos e mudar o estado da interface.'`
          );
          //1atualizarLayoutDialogCV(user.uid);
          importarAlunosChamadaVirtual(user, alunosRef, chamadaRef);
          // TODO usar a função editar para editar a chamada só que sem o problema de deletar o aluno para adicionar de novo, provavelmente tme que usar o merge
        })
        .catch(e => {
          console.error('Error adding document: ', e);
        });
    }

    //2atualizarTextoBtnCV();
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
      .get({source: 'cache'})
      .then(doc => {
        var frequencia = doc.data().frequencia;
        frequencia[mesChamadaVirtualServer] = frequencia[mesChamadaVirtualServer] + 1;
        editarAlunoFrequencia(user, alunosRef, element.matricula, frequencia);
        console.log("O aluno teve a matrícula atualizada.")
      })
      .catch((error) => {
          // The document probably doesn't exist.
          var frequencia = [0, 0, 0, 0];
          frequencia[mesChamadaVirtualServer] = 1;
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
                <button type="button" class="btn btn-primary bf">${
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
      //Caso barra de pesquisa esteja preechida
      if(document.getElementById('searchbar').value != ""){
        escolherFunc()//exibe a lista de acordo com a barra de pesquisa
      }
    });
  return unsubscribe;
}

function monitorarEstadoChamadaVirtual(user, collectionRef) {
  return collectionRef
      .where('uid', '==', user.uid)
      .onSnapshot(querySnapshot => {
        const items = querySnapshot.docs.map(doc => {
          chamadaVirtualAtivadaServer = doc.data().chamadaAtiva;
          mesChamadaVirtualServer = doc.data().mes;
          atualizarTextoBtnCV(user.uid);
          console.log("A chamada está monitoradacomo" + chamadaVirtualAtivadaServer);  
      })
    });
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
    .get({source: 'cache'})
    .then(doc => {
      var frequencia = doc.data().frequencia;
      frequencia[mes] = valorFrec;
      editarAlunoFrequencia(user, alunosRef, matricula, frequencia);
    });
}

function configurarTitlyMonissor(){
  $("#navBarTitulo").on('click', function(e){
    e.preventDefault()
    configurarBtnComeBack()
    escolherFunc()
    console.log('ta funfando')
  })
}
