const { parse, transform } = require("@babel/core");

const PATH_REMOVE_ATTRS = ["id"];
const SVG_REMOVE_ATTRS = ["width", "height"];
const CLASS_NAME = `pb-icon`;

const pbfiedPlugin = ({ types: t }) => {
  return {
    name: "pbfiedPlugin",
    visitor: {
      ImportDeclaration(path) {
        if (path.node.source.value === "react") {
          path.insertAfter([
            t.importDeclaration(
              [t.importDefaultSpecifier(t.identifier("cx"))],
              t.stringLiteral("classnames")
            ),
            t.importDeclaration(
              [t.importDefaultSpecifier(t.identifier("styles"))],
              t.stringLiteral("./Icon.styles")
            )
          ]);
        }
      },
      JSXElement(path) {
        if (path.node.openingElement.name.name === "defs") {
          path.replaceWithMultiple(path.node.children.filter(t.isJSXElement));
        }

        if (path.node.openingElement.name.name === "use") {
          path.remove();
        }
      },
      JSXOpeningElement(path) {
        if (path.node.name.name === "svg") {
          path.node.attributes = [
            ...path.node.attributes.filter(
              a => !SVG_REMOVE_ATTRS.includes(a.name.name)
            ),
            t.jsxAttribute(
              t.jSXIdentifier("className"),
              t.jSXExpressionContainer(
                t.callExpression(t.identifier("cx"), [
                  t.memberExpression(
                    t.identifier("styles"),
                    t.identifier("icon")
                  ),
                  t.stringLiteral(CLASS_NAME)
                ])
              )
            )
          ];
        }

        if (path.node.name.name === "path") {
          path.node.attributes = [
            ...path.node.attributes.filter(
              a => !PATH_REMOVE_ATTRS.includes(a.name.name)
            )
          ];
        }
      }
    }
  };
};

module.exports = pbfiedPlugin;
