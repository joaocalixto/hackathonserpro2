var messages_array = [
{"message_id":1, "message_order":"0", "message_text":"Oi, tudo bem? Eu sou o bot do leão, eu posso lhe ajudar e tirar duvidas sobre a declaração do seu imposto de renda. Como posso lhe ajudar hoje?","message_ok_id":1, "message_nok_id":2, "message_yes_answer":"sim|s|SIM|Sim|claro", "message_no_answer":"nao|n\u00e3o|n|N\u00e3o", "message_option_answer":""},
 {"message_id":2, "message_order":"1", "message_text":"Deixe eu te ajudar realizar seu sonho. Que mês seria interessante para você?", "message_ok_id":0, "message_nok_id":0, "message_yes_answer":"WS:bill", "message_no_answer":"", "message_option_answer":""},
 {"message_id":3, "message_order":"2", "message_text":"Me informe o seu email, que, sem compromisso, vou lhe enviar um orçamento personalizado.", "message_ok_id":-1, "message_nok_id":-1, "message_yes_answer":"", "message_no_answer":"", "message_option_answer":""},
 {"message_id":4, "message_order":"3", "message_text":"Obrigado, em breve entramos em contato.", "message_ok_id":5, "message_nok_id":4, "message_yes_answer":"sim|s|SIM|Sim|claro", "message_no_answer":"nao|n\u00e3o|n|N\u00e3o", "message_option_answer":""},
 {"message_id":7, "message_order":"4", "message_text":"Obrigado ate a proxima.", "message_ok_id":-1, "message_nok_id":-1, "message_yes_answer":"", "message_no_answer":"", "message_option_answer":""},
 {"message_id":8, "message_order":"5", "message_text":"Digite seu cpf", "message_ok_id":6, "message_nok_id":0, "message_yes_answer":"FUNC:CPF", "message_no_answer":"", "message_option_answer":""},
 {"message_id":9, "message_order":"6", "message_text":"Tire uma selfie", "message_ok_id":0, "message_nok_id":0, "message_yes_answer":"WS:fd10", "message_no_answer":"", "message_option_answer":""}]


 module.exports = {
  get: function(index) {
    return messages_array[index];
  }
  };