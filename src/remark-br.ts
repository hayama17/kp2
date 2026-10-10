/**
 * remark plugin: turn a literal `<br>` into a line break.
 *
 * react-markdown drops raw HTML, so `<br>` would otherwise be shown as text. Headings are the
 * main reason to want it: Markdown has no other way to break a line inside one. Only a node
 * whose whole value is a single `<br>` tag is converted; any other HTML stays ignored, so this
 * does not open the door to scripts or event handlers in a runbook.
 */

interface Node {
  type: string;
  value?: string;
  children?: Node[];
}

const BR = /^<br\s*\/?>$/i;

export default function remarkBr() {
  return (tree: Node) => {
    const walk = (node: Node) => {
      if (!node.children) return;
      for (const child of node.children) {
        if (child.type === 'html' && child.value !== undefined && BR.test(child.value.trim())) {
          child.type = 'break';
          delete child.value;
        } else {
          walk(child);
        }
      }
    };
    walk(tree);
  };
}
