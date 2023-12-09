start = arr:(header / content / newline)+ {
   return arr.flat();
}

newline = [\n] {
    return { type: 'text', content: '\n' };
}

header = level:'#'+ __ text:[^\n]+ {
    const content = level.join('') + ' ' + text.join('');
    return { type: 'header', content, level: level.length };
}

list_item = '*' __ text:[^\n]+ {
    return { type: 'list', content: '* ' + text.join('') };
}

inline_text = bold / italic / inline_link / list_item / [^\n]

content = arr:inline_text+ {
    return arr.reduce((acc, item) => {
       if (typeof item === 'string') {
          if (acc.length) {
              const last = acc[acc.length - 1];
              if (last.type === 'text') {
                  last.content += item;
                  return acc;
              }
          }
          acc.push({ type: 'text', content: item });
          return acc;
       } else {
          acc.push(item);
          return acc;
       }
    }, []);
}

inline_link = '[' text:[^\]]* ']' '(' url:[^)]+ ')' {
    return {
        type: 'link',
        text: text.join(''),
        url: url.join('')
    };
}

bold = bold_a / bold_b

bold_a = '__' text:(text_bold_a / italic) '__' {
    return { type: 'bold', content: `__${text}__` };
}
text_bold_a = text:[^_]+ {
    return text.join('');
}

bold_b = '**' text:(text_bold_b / italic) '**' {
    return { type: 'bold', content: `**${text}**` };
}

text_bold_b = text:[^*]+ {
    return text.join('');
}

italic = italic_a / italic_b

italic_a = '*' !' ' text:[^*]+ !' ' '*' {
    return { type: 'italic', content: `*${text.join('')}*` };
}

italic_b = '_' text:[^_]+ '_' {
    return { type: 'italic', content: `_${text.join('')}_` };
}

_ "whitespace" = [ \t]*
__ "whitespace" = [ \t]
