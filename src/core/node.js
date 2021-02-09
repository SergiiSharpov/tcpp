

class Node {
  parent = null;
  children = new Set();
  isGlobal = false;
  
  name = '';

  append(node) {
    this.children.add(node);

    // if (node.parent) {
    //   node.parent.children.delete(node);
    // }

    //node.parent = this;
  }

  remove(node) {
    if (this.children.has(node)) {
      this.children.delete(node);
      node.parent = null;
    }
  }

  getGlobalNodes(recursive = false, container = []) {
    for (let child of this.children) {
      if (child.isGlobal) {
        container.push(child);
        if (recursive) {
          child.getGlobalNodes(recursive, container);
        }
      }
    }

    return container;
  }

  getLocalNodes(recursive = false, container = []) {
    for (let child of this.children) {
      if (!child.isGlobal) {
        container.push(child);
        if (recursive) {
          child.getGlobalNodes(recursive, container);
        }
      }
    }

    return container;
  }
}

export default Node;