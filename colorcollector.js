const sectionModes = {};
let sectionModeTotal;
let cardModeTotal;
window.addEventListener("DOMContentLoaded", (event) => {
  const targetStylesheet = document.querySelector("#lumos-colors");
  if (targetStylesheet) {
    const rules = targetStylesheet.sheet.cssRules || targetStylesheet.sheet.rules;
    sectionModeTotal = countModes(/sm0-\d+/g, rules);
    cardModeTotal = countModes(/cm0-\d+/g, rules);

    function getResolvedValue(value) {
      const variables = value.match(/var\(([^)]+)\)/g);
      if (variables) {
        for (const variable of variables) {
          const variableName = variable.match(/var\(([^)]+)\)/)[1].trim();
          const variableValue = getComputedStyle(document.documentElement).getPropertyValue(variableName);
          value = value.replace(variable, variableValue);
        }
      }
      return value;
    }
    function countModes(classNamePattern, rules) {
      const uniqueClassNames = new Set();
      for (const rule of rules) {
        const ruleText = rule.cssText || rule.style.cssText;
        const classNames = ruleText.match(classNamePattern);
        if (classNames) {
          classNames.forEach((className) => {
            uniqueClassNames.add(className);
          });
        }
      }
      return uniqueClassNames.size;
    }

    for (let i = 1; i <= sectionModeTotal; i++) {
      let sectionIndex = i;
      sectionModes[`sectionMode${sectionIndex}`] = {};
      sectionModes[`sectionMode${sectionIndex}`]["mode"] = {};
      for (let i = 1; i <= cardModeTotal; i++) {
        sectionModes[`sectionMode${sectionIndex}`][`cardMode${i}`] = {};
      }
    }

    for (const rule of rules) {
      if (rule instanceof CSSStyleRule) {
        for (let i = 1; i <= sectionModeTotal; i++) {
          let sectionIndex = i;
          if (rule.selectorText.includes(`[class*="sm0-${sectionIndex}"],`)) {
            for (let i = 0; i < rule.style.length; i++) {
              const property = rule.style[i];
              const value = getResolvedValue(rule.style.getPropertyValue(property));
              sectionModes[`sectionMode${sectionIndex}`]["mode"][property] = value;
            }
          }
          for (let i = 1; i <= cardModeTotal; i++) {
            const selector = `:is([section-mode="${sectionIndex}"], [class*="sm0-${sectionIndex}"]) :is([card-mode="${i}"], [class*="cm0-${i}"])`;
            if (rule.selectorText.includes(selector)) {
              for (let j = 0; j < rule.style.length; j++) {
                const property = rule.style[j];
                const value = getResolvedValue(rule.style.getPropertyValue(property));
                sectionModes[`sectionMode${sectionIndex}`][`cardMode${i}`][property] = value;
              }
            }
          }
        }
      }
    }
  }
});
