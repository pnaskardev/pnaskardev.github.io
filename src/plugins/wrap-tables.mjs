/**
 * Wraps every table in a scroll container so a wide table scrolls itself
 * instead of making the whole page scroll sideways on mobile.
 */
export function rehypeWrapTables() {
  return (tree) => {
    const walk = (node) => {
      if (!Array.isArray(node.children)) return;

      node.children = node.children.map((child) => {
        walk(child);
        if (child.type !== 'element' || child.tagName !== 'table') return child;

        return {
          type: 'element',
          tagName: 'div',
          properties: { className: ['table-scroll'] },
          children: [child],
        };
      });
    };

    walk(tree);
  };
}
