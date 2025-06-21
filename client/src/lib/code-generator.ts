import { Entity } from "@shared/schema";

export function generatePythonCode(entities: Entity[]): string {
  if (entities.length === 0) {
    return "# No entities to generate code for";
  }

  let code = "from dataclasses import dataclass\n";
  code += "from typing import Optional\n";
  code += "from datetime import datetime\n";
  code += "from decimal import Decimal\n\n";

  entities.forEach(entity => {
    code += `@dataclass\n`;
    code += `class ${entity.name}:\n`;
    
    if (entity.description) {
      code += `    """${entity.description}"""\n`;
    }
    
    entity.attributes.forEach(attr => {
      const pythonType = getPythonType(attr.type);
      const optional = attr.isRequired ? "" : "Optional[";
      const closing = attr.isRequired ? "" : "]";
      const defaultValue = attr.isRequired ? "" : " = None";
      
      let comment = "";
      if (attr.isPrimaryKey) comment += " # Primary Key";
      if (attr.isUnique) comment += " # Unique";
      
      code += `    ${attr.name}: ${optional}${pythonType}${closing}${defaultValue}${comment}\n`;
    });
    
    code += "\n";
  });

  return code;
}

function getPythonType(type: string): string {
  switch (type) {
    case "int": return "int";
    case "string": return "str";
    case "decimal": return "Decimal";
    case "datetime": return "datetime";
    case "boolean": return "bool";
    default: return "str";
  }
}
