const getTemplate = templateContent => {
  let template = document.createElement('template');
  template.innerHTML = templateContent;
  return template.content;
};

export default getTemplate;
