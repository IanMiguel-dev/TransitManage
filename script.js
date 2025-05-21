// Controle de Login/Signup
const loginForm = document.getElementById('login-form');
const signupForm = document.getElementById('signup-form');

if (loginForm && signupForm) {
  document.getElementById('criar-conta-link').addEventListener('click', (e) => {
    e.preventDefault();
    loginForm.style.display = 'none';
    signupForm.style.display = 'block';
  });

  document.getElementById('login-link').addEventListener('click', (e) => {
    e.preventDefault();
    signupForm.style.display = 'none';
    loginForm.style.display = 'block';
  });

  loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const senha = document.getElementById('password').value;
    const users = JSON.parse(localStorage.getItem('users')) || [];
    const user = users.find(u => u.email === email && u.senha === senha);

    if (user) {
      localStorage.setItem('currentUser', email);
      window.location.href = 'dashboard.html';
    } else {
      alert('Email ou senha incorretos.');
    }
  });

  signupForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('signup-email').value;
    const senha = document.getElementById('signup-password').value;
    const users = JSON.parse(localStorage.getItem('users')) || [];

    if (users.find(u => u.email === email)) {
      alert('Email já cadastrado!');
    } else {
      users.push({ email, senha });
      localStorage.setItem('users', JSON.stringify(users));
      alert('Conta criada com sucesso!');
      signupForm.reset();
      signupForm.style.display = 'none';
      loginForm.style.display = 'block';
    }
  });
}

// Dashboard
const tabela = document.getElementById('tabela-agendamentos')?.querySelector('tbody');
const formAgendamento = document.getElementById('form-agendamento');

if (formAgendamento) {
  const agendamentos = JSON.parse(localStorage.getItem('agendamentos')) || [];

  document.getElementById('user-email').innerText = localStorage.getItem('currentUser');

  formAgendamento.addEventListener('submit', (e) => {
    e.preventDefault();
    const novoAgendamento = {
      datetime: formAgendamento.datetime.value,
      embarque: formAgendamento.embarque.value,
      desembarque: formAgendamento.desembarque.value,
      motorista: formAgendamento.motorista.value,
      carro: formAgendamento.carro.value,
      paciente: formAgendamento.paciente.value,
      observacoes: formAgendamento.observacoes.value
    };
    agendamentos.push(novoAgendamento);
    localStorage.setItem('agendamentos', JSON.stringify(agendamentos));
    renderizarTabela();
    formAgendamento.reset();
  });

  function renderizarTabela() {
    tabela.innerHTML = '';
    agendamentos.sort((a, b) => new Date(a.datetime) - new Date(b.datetime));

    agendamentos.forEach((item, index) => {
      const row = tabela.insertRow();
      row.insertCell(0).innerText = item.datetime;
      row.insertCell(1).innerText = item.embarque;
      row.insertCell(2).innerText = item.desembarque;
      row.insertCell(3).innerText = item.motorista;
      row.insertCell(4).innerText = item.carro;
      row.insertCell(5).innerText = item.paciente;
      row.insertCell(6).innerText = item.observacoes;

      const acoes = row.insertCell(7);
      const editarBtn = document.createElement('button');
      editarBtn.textContent = 'Editar';
      editarBtn.onclick = () => editarAgendamento(index);

      const excluirBtn = document.createElement('button');
      excluirBtn.textContent = 'Excluir';
      excluirBtn.onclick = () => excluirAgendamento(index);

      acoes.appendChild(editarBtn);
      acoes.appendChild(excluirBtn);
    });
  }

  function excluirAgendamento(index) {
    if (confirm('Deseja excluir este agendamento?')) {
      agendamentos.splice(index, 1);
      localStorage.setItem('agendamentos', JSON.stringify(agendamentos));
      renderizarTabela();
    }
  }

  function editarAgendamento(index) {
    const ag = agendamentos[index];
    formAgendamento.datetime.value = ag.datetime;
    formAgendamento.embarque.value = ag.embarque;
    formAgendamento.desembarque.value = ag.desembarque;
    formAgendamento.motorista.value = ag.motorista;
    formAgendamento.carro.value = ag.carro;
    formAgendamento.paciente.value = ag.paciente;
    formAgendamento.observacoes.value = ag.observacoes;
    agendamentos.splice(index, 1);
  }

  renderizarTabela();
}

function logout() {
  localStorage.removeItem('currentUser');
  window.location.href = 'index.html';
}
