window.CONTENIDO = {
  version: "2.0.0",
  recursos: [window.RECURSOS.rover, window.RECURSOS.educador, window.RECURSOS.distrito]
};

window.CONTENIDOPorId = function (id) {
  return (
    window.CONTENIDO.recursos.find(function (recurso) {
      return recurso.id === id;
    }) || window.CONTENIDO.recursos[0]
  );
};
