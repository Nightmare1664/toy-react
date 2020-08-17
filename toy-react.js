class ElementWrapper {
  constructor(type) {
    this.root = document.createElement(type);
  }

  setAttribute(key, value) {
    this.root.setAttribute(key, value);
  }

  appendChild(component) {
    this.root.appendChild(component.root);
  }
}

class TextWrapper {
  constructor(content) {
    this.root = document.createTextNode(content);
  }
}

export class Component {
  constructor() {
    this.props = Object.create(null);
    this.children = [];
    this._root = null;
  }

  setAttribute(key, value) {
    this.props[key] = value;
  }

  appendChild(component) {
    this.children.push(component);
  }

  get root() {
    if (!this._root) {
      this._root = this.render().root;
    }
    return this._root;
  }
}

export function createElement(type, attributes, ...children) {
  let e;
  if (typeof type === "string") {
    e = new ElementWrapper(type);
  } else {
    e = new type();
  }
  for (const key in attributes) {
    if (attributes.hasOwnProperty(key)) {
      const value = attributes[key];
      e.setAttribute(key, value);
    }
  }
  const insertChildren = (children) => {
    for (const child of children) {
      if (typeof child === "string") {
        child = new TextWrapper(child);
      }
      if (typeof child === "object" && child instanceof Array) {
        insertChildren(child);
      } else {
        e.appendChild(child);
      }
    }
  };

  insertChildren(children);

  return e;
}

export function render(component, parentElement) {
  parentElement.appendChild(component.root);
}
