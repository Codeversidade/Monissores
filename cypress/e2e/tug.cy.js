/// <reference types="cypress"/>

const { slowCypressDown } = require('cypress-slow-down');

slowCypressDown(700);

describe('Teste de Uso Geral', () => {
  beforeEach(() => {
    cy.visit('/?mode=dev');
  });

  it('1 Adicionar Aluno', () => {
    //cy.get('.firebaseui-idp-button').click()
    cy.get('#addAluno').click();
    // dummy input to "warm up" Cypress
    cy.get('#nomeAdicionarAlunoInput').type('Aluno Teste');
    cy.get('#matriculaAdicionarAlunoInput').type('2008111111');
    cy.get('#salvarAlunoNovoBtn').click();
    cy.get(
      '#addAlunoModalDialog > .modal-dialog > .modal-content > .modal-header > .btn-close'
    ).click();

    // Checa se o aluno foi adicionado na interface
    cy.contains('Aluno Teste').should('be.visible');
    cy.contains('2008111111').should('be.visible');

    cy.get('#\\32 008111111-0 > .btn-group > .bf').contains('0');
  });

  it('2 Adicionar Aluno', () => {
    //cy.get('.firebaseui-idp-button').click()
    cy.get('#addAluno').click();
    // dummy input to "warm up" Cypress
    cy.get('#nomeAdicionarAlunoInput').type('Alana');
    cy.get('#matriculaAdicionarAlunoInput').type('2008222222');
    cy.get('#salvarAlunoNovoBtn').click();
    cy.get(
      '#addAlunoModalDialog > .modal-dialog > .modal-content > .modal-header > .btn-close'
    ).click();

    // Checa se o aluno foi adicionado na interface
    cy.contains('Alana').should('be.visible');
    cy.contains('2008222222').should('be.visible');

    cy.get('#\\32 008111111-0 > .btn-group > .bf').contains('0');
  });

  it('1 Alterar Frequência', () => {
    // Checa se o Aluno Teste foi adicionado na interface
    cy.contains('Aluno Teste').should('be.visible');
    cy.contains('2008111111').should('be.visible');

    cy.get('#\\32 008111111-0 > .btn-group > .bf').contains('0');

    // Aumenta a Frequência Aluno Teste
    cy.get('#\\32 008111111-BA0').click();
    cy.get('#\\32 008111111-BA0').click();
    cy.get('#\\32 008111111-0 > .btn-group > .bf').contains('2');

    // Diminui a Frequência Aluno Teste
    cy.get('#\\32 008111111-BD0').click();
    cy.get('#\\32 008111111-BD0').click();
    cy.get('#\\32 008111111-0 > .btn-group > .bf').contains('0');
  });

  it('2 Alterar Frequência', () => {
    // Checa se o Alana foi adicionada na interface
    cy.contains('Alana').should('be.visible');
    cy.contains('2008222222').should('be.visible');

    cy.get('#\\32 008222222-0 > .btn-group > .bf').contains('0');

    // Aumenta a Frequência Alana
    cy.get('#\\32 008222222-BA0').click();
    cy.get('#\\32 008222222-BA0').click();
    cy.get('#\\32 008222222-0 > .btn-group > .bf').contains('2');
  });

  it('Abrir Chamada Virtual', () => {
    cy.get('#chamadaVirtual > table > tbody > :nth-child(2) > td').contains(
      'Desativada'
    );
    cy.get('#chamadaVirtual').click();
    cy.get('#ativarCVSwitch').click();
    cy.get('#inputLinkChamadaVirtual')
      .invoke('val')
      .then(sometext => {
        cy.log('Les go to:' + sometext);
        cy.visit(sometext);
      });
    cy.get('#enviarChamadaBtn').should('be.visible');
  });

  it('1 Preenchimento da Chamada Virtual', () => {
    cy.wait(500);

    cy.get('#chamadaVirtual > table > tbody > :nth-child(2) > td').contains(
      'Ativada'
    );
    cy.get('#chamadaVirtual').click();
    cy.get('#inputLinkChamadaVirtual')
      .invoke('val')
      .then(sometext => {
        cy.log('Les go to:' + sometext);
        cy.visit(sometext);
        cy.origin(sometext, () => {
            cy.get('#enviarChamadaBtn').should('be.visible');

            cy.get('#nomeChamadaInput').type('Aluno Teste');
            cy.get('#matriculaChamadaInput').type('2008111111');
            cy.get('#enviarChamadaBtn').click();
            cy.get('#secaoChamadaPreenchida > p > strong')
              .contains('Pronto')
              .should('be.visible');
          });
        });
      });  

  it('2 Preenchimento da Chamada Virtual', () => {
    cy.get('#chamadaVirtual > table > tbody > :nth-child(2) > td').contains(
      'Ativada'
    );
    cy.get('#chamadaVirtual').click();
    cy.get('#inputLinkChamadaVirtual')
      .invoke('val')
      .then(sometext => {
        cy.log('Les go to:' + sometext);
        cy.visit(sometext);
        cy.origin(sometext, () => {
          cy.get('#enviarChamadaBtn').should('be.visible');
  
          cy.get('#nomeChamadaInput').type('Alana');
          cy.get('#matriculaChamadaInput').type('2008222222');
          cy.get('#enviarChamadaBtn').click();
          cy.get('#secaoChamadaPreenchida > p > strong')
            .contains('Pronto')
            .should('be.visible');
          });
        });
  });

  it('3 Preenchimento da Chamada Virtual', () => {
    cy.get('#chamadaVirtual > table > tbody > :nth-child(2) > td').contains(
      'Ativada'
    );
    cy.get('#chamadaVirtual').click();
    cy.get('#inputLinkChamadaVirtual')
      .invoke('val')
      .then(sometext => {
        cy.log('Les go to:' + sometext);
        cy.visit(sometext);
        cy.origin(sometext, () => {
          cy.get('#enviarChamadaBtn').should('be.visible');
      
          cy.get('#nomeChamadaInput').type('Alex');
          cy.get('#matriculaChamadaInput').type('2008333333');
          cy.get('#enviarChamadaBtn').click();
          cy.get('#secaoChamadaPreenchida > p > strong')
            .contains('Pronto')
            .should('be.visible');
        });
      });
  });

  it('Checar se os 3 Alunos foram cadastrados na Chamada Virtual', () => {
    cy.get('#chamadaVirtual > table > tbody > :nth-child(2) > td').contains(
      'Ativada'
    );
    cy.get('#chamadaVirtual').click();
    cy.get('#alunosListaChamadaVirtual').contains('Aluno Teste');
    cy.get('#alunosListaChamadaVirtual').contains('2008111111');
    cy.get('#alunosListaChamadaVirtual').contains('Alana');
    cy.get('#alunosListaChamadaVirtual').contains('2008222222');
    cy.get('#alunosListaChamadaVirtual').contains('Alex');
    cy.get('#alunosListaChamadaVirtual').contains('2008333333');
  });

  it('Fechar Chamada Virtual', () => {
    cy.get('#chamadaVirtual > table > tbody > :nth-child(2) > td').contains(
      'Ativada'
    );
    cy.get('#chamadaVirtual').click();
    cy.get('#importarAlunosCVBtn').click();
    cy.get('#toastChamadaVirtualFechada > .d-flex > .toast-body').should(
      'be.visible'
    );
    cy.get(
      '#chamadaVirtualModalDialog > .modal-dialog > .modal-content > .modal-header > .btn-close'
    ).click();
    cy.get('#chamadaVirtual > table > tbody > :nth-child(2) > td').contains(
      'Desativada'
    );
  });

  it('Checar as frequências dos 3 Alunos após Chamada Virtual', () => {
    cy.get('#chamadaVirtual > table > tbody > :nth-child(2) > td').contains(
      'Desativada'
    );

    // Frequência Alex
    cy.get('#\\32 008333333-0 > .btn-group > .bf')
      .contains('1')
      .should('be.visible');
    // Frequência Aluno Teste
    cy.get('#\\32 008111111-0 > .btn-group > .bf').contains('1');
    // Frequência Alana
    cy.get('#\\32 008222222-0 > .btn-group > .bf').contains('3');
    cy.get('#\\32 008222222-BA0').click();
    cy.get('#\\32 008222222-0 > .btn-group > .bf').contains('4');
  });

  it('2 Abrir Chamada Virtual', () => {
    cy.get('#chamadaVirtual > table > tbody > :nth-child(2) > td').contains(
      'Desativada'
    );
    cy.get('#chamadaVirtual').click();
    cy.get('#ativarCVSwitch').click();
    cy.get('#inputLinkChamadaVirtual')
      .invoke('val')
      .then(sometext => {
        cy.log('Les go to:' + sometext);
        cy.visit(sometext);
      });
    cy.get('#enviarChamadaBtn').should('be.visible');
  });

  it('4 Preenchimento da Chamada Virtual', () => {
    cy.get('#chamadaVirtual > table > tbody > :nth-child(2) > td').contains(
      'Ativada'
    );
    cy.get('#chamadaVirtual').click();
    cy.get('#inputLinkChamadaVirtual')
      .invoke('val')
      .then(sometext => {
        cy.log('Les go to:' + sometext);
        cy.visit(sometext);
        cy.origin(sometext, () => {
          cy.get('#enviarChamadaBtn').should('be.visible');
      
          cy.get('#nomeChamadaInput').type('Aluno Teste com Nome Errado');
          cy.get('#matriculaChamadaInput').type('2008111111');
          cy.get('#enviarChamadaBtn').click();
          cy.get('#secaoChamadaPreenchida > p > strong')
            .contains('Pronto')
            .should('be.visible');
        });
      });
  });

  it('5 Preenchimento da Chamada Virtual', () => {
    cy.get('#chamadaVirtual > table > tbody > :nth-child(2) > td').contains(
      'Ativada'
    );
    cy.get('#chamadaVirtual').click();
    cy.get('#inputLinkChamadaVirtual')
      .invoke('val')
      .then(sometext => {
        cy.log('Les go to:' + sometext);
        cy.visit(sometext);
        cy.origin(sometext, () => {
          cy.get('#enviarChamadaBtn').should('be.visible');
      
          cy.get('#nomeChamadaInput').type('Alana');
          cy.get('#matriculaChamadaInput').type('2008222222');
          cy.get('#enviarChamadaBtn').click();
          cy.get('#secaoChamadaPreenchida > p > strong')
            .contains('Pronto')
            .should('be.visible');
        });
      });
  });

  it('6 Preenchimento da Chamada Virtual', () => {
    cy.get('#chamadaVirtual > table > tbody > :nth-child(2) > td').contains(
      'Ativada'
    );
    cy.get('#chamadaVirtual').click();
    cy.get('#inputLinkChamadaVirtual')
      .invoke('val')
      .then(sometext => {
        cy.log('Les go to:' + sometext);
        cy.visit(sometext);
        cy.origin(sometext, () => {
          cy.get('#enviarChamadaBtn').should('be.visible');
      
          cy.get('#nomeChamadaInput').type('Alex');
          cy.get('#matriculaChamadaInput').type('2008333333');
          cy.get('#enviarChamadaBtn').click();
          cy.get('#secaoChamadaPreenchida > p > strong')
            .contains('Pronto')
            .should('be.visible');
        });
      });
  });

  it('7 Preenchimento da Chamada Virtual', () => {
    cy.get('#chamadaVirtual > table > tbody > :nth-child(2) > td').contains(
      'Ativada'
    );
    cy.get('#chamadaVirtual').click();
    cy.get('#inputLinkChamadaVirtual')
      .invoke('val')
      .then(sometext => {
        cy.log('Les go to:' + sometext);
        cy.visit(sometext);
        cy.origin(sometext, () => {
          cy.get('#enviarChamadaBtn').should('be.visible');
      
          cy.get('#nomeChamadaInput').type('Alisson');
          cy.get('#matriculaChamadaInput').type('2008444444');
          cy.get('#enviarChamadaBtn').click();
          cy.get('#secaoChamadaPreenchida > p > strong')
            .contains('Pronto')
            .should('be.visible');
        });
      });
  });

  it('Checar se os 4 Alunos foram cadastrados na Chamada Virtual', () => {
    cy.get('#chamadaVirtual > table > tbody > :nth-child(2) > td').contains(
      'Ativada'
    );
    cy.get('#chamadaVirtual').click();
    cy.get('#alunosListaChamadaVirtual').contains(
      'Aluno Teste com Nome Errado'
    );
    cy.get('#alunosListaChamadaVirtual').contains('2008111111');
    cy.get('#alunosListaChamadaVirtual').contains('Alana');
    cy.get('#alunosListaChamadaVirtual').contains('2008222222');
    cy.get('#alunosListaChamadaVirtual').contains('Alex');
    cy.get('#alunosListaChamadaVirtual').contains('2008333333');
    cy.get('#alunosListaChamadaVirtual').contains('Alisson');
    cy.get('#alunosListaChamadaVirtual').contains('2008444444');
  });

  it('2 Fechar Chamada Virtual', () => {
    cy.get('#chamadaVirtual > table > tbody > :nth-child(2) > td').contains(
      'Ativada'
    );
    cy.get('#chamadaVirtual').click();
    cy.get('#ativarCVSwitch').click();
    cy.get('#toastChamadaVirtualFechada > .d-flex > .toast-body').should(
      'be.visible'
    );
    cy.get(
      '#chamadaVirtualModalDialog > .modal-dialog > .modal-content > .modal-header > .btn-close'
    ).click();
    cy.get('#chamadaVirtual > table > tbody > :nth-child(2) > td').contains(
      'Desativada'
    );
  });

  it('Checar as frequências dos 4 Alunos após Chamada Virtual', () => {
    cy.get('#chamadaVirtual > table > tbody > :nth-child(2) > td').contains(
      'Desativada'
    );

    // Frequência Aluno Teste
    cy.contains('Aluno Teste').should('be.visible');
    cy.contains('2008111111').should('be.visible');
    cy.get('#\\32 008111111-0 > .btn-group > .bf').contains('2');
    // Frequência Alana
    cy.get('#\\32 008222222-0 > .btn-group > .bf').contains('5');
    // Frequência Alex
    cy.get('#\\32 008333333-0 > .btn-group > .bf').contains('2');
    // Frequência Alisson
    cy.contains('Alisson').should('be.visible');
    cy.contains('2008444444').should('be.visible');
    cy.get('#\\32 008444444-0 > .btn-group > .bf').contains('1');
  });

  it('Checar Relatório Mes 1', () => {
    cy.get('#relatorioBtn > .material-symbols-outlined').click();
    cy.get('#dropdownMesesRelatorioBtn').click();
    cy.get(':nth-child(1) > .dropdown-item').click();

    cy.contains('Aluno Teste/2008111111/2 vezes;');
    cy.contains('Alana/2008222222/5 vezes;');
    cy.contains('Alex/2008333333/2 vezes;');
    cy.contains('Alisson/2008444444/1 vez;');
  });

  it('Checar Relatório Mes 2', () => {
    cy.get('#relatorioBtn > .material-symbols-outlined').click();
    cy.get('#dropdownMesesRelatorioBtn').click();
    cy.get(':nth-child(2) > .dropdown-item').click();

    cy.contains('Aluno Teste/2008111111/0 vezes;');
    cy.contains('Alana/2008222222/0 vezes;');
    cy.contains('Alex/2008333333/0 vezes;');
    cy.contains('Alisson/2008444444/0 vezes;');
  });

  it('1 Editar Nome Aluno', () => {
    // Edita o Aluno Teste
    cy.get('#\\32 008111111-0').rightclick();
    cy.get('#navBarTitulo').contains('1 aluno');

    cy.get('#editBtn > .material-symbols-outlined').click();
    cy.get('#nomeEditarAlunoInput').clear().type('Aluno Teste com Nome Errado');
    cy.get('#matriculaEditarAlunoInput').clear().type('2008111111');
    cy.get('#editarAlunoBtn').click();
    cy.get('#toastEditarAluno > .d-flex').should('be.visible');
    cy.get(
      '#editAlunoModalDialog > .modal-dialog > .modal-content > .modal-header > .btn-close'
    ).click();
    cy.get('#desselecionarTudoBtn > .material-symbols-outlined').click();
    cy.contains('Aluno Teste com Nome Errado');
  });

  it('2 Editar Nome e Matricula Aluno', () => {
    // Edita o Aluno Teste
    cy.get('#\\32 008111111-0').rightclick();
    cy.get('#navBarTitulo').contains('1 aluno');

    cy.get('#editBtn > .material-symbols-outlined').click();
    cy.get('#nomeEditarAlunoInput').clear().type('Aluno Teste');
    cy.get('#matriculaEditarAlunoInput').clear().type('2009111111');
    cy.get('#editarAlunoBtn').click();
    cy.get('#toastEditarAluno > .d-flex').should('be.visible');
    cy.get(
      '#editAlunoModalDialog > .modal-dialog > .modal-content > .modal-header > .btn-close'
    ).click();
    cy.get('#desselecionarTudoBtn > .material-symbols-outlined').click();
    cy.contains('Aluno Teste');
    cy.contains('2009111111');
  });

  it('3 Editar Matricula Aluno', () => {
    // Edita o Aluno Teste
    cy.get('#\\32 009111111-0').rightclick();
    cy.get('#navBarTitulo').contains('1 aluno');

    cy.get('#editBtn > .material-symbols-outlined').click();
    cy.get('#matriculaEditarAlunoInput').clear().type('2008111111');
    cy.get('#editarAlunoBtn').click();
    cy.get('#toastEditarAluno > .d-flex').should('be.visible');
    cy.get(
      '#editAlunoModalDialog > .modal-dialog > .modal-content > .modal-header > .btn-close'
    ).click();
    cy.get('#navBarTitulo').contains('1 aluno');

    // Comentando pq ele tá se desselecionando sozinho cy.get('#desselecionarTudoBtn > .material-symbols-outlined').click();

    cy.contains('Aluno Teste');
    cy.contains('2008111111');
  });

  it('1 Deletar Aluno', () => {
    // Deleta o Aluno Teste
    cy.get('#\\32 008111111-0').rightclick();
    cy.get('#navBarTitulo').contains('1 aluno');

    cy.get('#removeBtn > .material-symbols-outlined').click();
    cy.get('#removeAlunoModalDialogBtn').click();
    cy.get('#\\32 008111111-0').should('not.exist');
    cy.get('#\\32 008222222-0').should('be.visible');
    cy.get('#\\32 008333333-0').should('be.visible');
    cy.get('#\\32 008444444-0').should('be.visible');
  });

  it('2/3/4 Deletar Alunos', () => {
    cy.get('#\\32 008222222-0').should('be.visible');
    cy.get('#\\32 008333333-0').should('be.visible');
    cy.get('#\\32 008444444-0').should('be.visible');
    cy.get('#\\32 008111111-0').should('not.exist');

    // Deleta Alana, Alex e Alisson
    cy.get('#\\32 008222222-0').rightclick();
    cy.get('#\\32 008333333-0').click();
    cy.get('#\\32 008333333-0').click();
    cy.get('#selecionarTudoBtn > .material-symbols-outlined').click();
    cy.get('#navBarTitulo').contains('3 alunos');

    cy.get('#removeBtn > .material-symbols-outlined').click();
    cy.get('#removeAlunoModalDialogBtn').click();

    // Checa se os alunos foram deletados
    cy.get('#\\32 008222222-0').should('not.exist');
    cy.get('#\\32 008333333-0').should('not.exist');
    cy.get('#\\32 008444444-0').should('not.exist');
  });
});
