import { languages } from './languages.mjs';
export function structuredData(lang, content, entries, base) {
  const url = `${base}/${lang}/`;
  return {'@context':'https://schema.org','@graph':[
    {'@type':'WebSite','@id':`${base}/#website`,name:'BrainHarness',url:`${base}/`,sameAs:'https://github.com/zning1994/brainharness',inLanguage:Object.values(languages).map(l=>l.tag)},
    {'@type':'CollectionPage','@id':`${url}#page`,url,name:`BrainHarness | ${content.title}`,description:content.description,inLanguage:languages[lang].tag,isPartOf:{'@id':`${base}/#website`},mainEntity:{'@id':`${url}#skills`}},
    {'@type':'ItemList','@id':`${url}#skills`,itemListElement:entries.map((entry,i)=>({'@type':'ListItem',position:i+1,item:{'@type':'SoftwareSourceCode',name:`BrainHarness ${content.skills[i].name}`,description:content.skills[i].description,url:`${url}#${entry.slug}`,codeRepository:entry.url,license:'https://opensource.org/license/mit'}}))},
  ]};
}
export const safeJson = value => JSON.stringify(value).replace(/</g,'\\u003c');
export function sitemap(base, escape, detailGroups = []) {
  const variants = [...Object.entries(languages).map(([key,value])=>[value.tag,`${base}/${key}/`]),['x-default',`${base}/`]];
  const renderGroup = variants => {
  const links = variants.map(([tag,url])=>`<xhtml:link rel="alternate" hreflang="${tag}" href="${escape(url)}"/>`).join('');
  return [...new Set(variants.map(([,url])=>url))].map(url=>`<url><loc>${escape(url)}</loc>${links}</url>`).join('');
  };
  return `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">${[variants,...detailGroups].map(renderGroup).join('')}</urlset>`;
}
export function llmsText(base, locales, entries) {
  return `# BrainHarness\n\n> ${locales.en.description}\n\n## Canonical pages\n\n${Object.entries(languages).map(([key,info])=>`- [${info.label}](${base}/${key}/): Localized official overview and installation instructions.`).join('\n')}\n\n## Skill guides\n\n${['cooking','docs','autoresearch'].map((key,i)=>`- [BrainHarness ${locales.en.skills[i].name}](${base}/en/skills/${key}/): Usage, requirements, installation and FAQ.`).join('\n')}\n\n## Skills and source\n\n${entries.map((entry,i)=>`- [BrainHarness ${locales.en.skills[i].name}](${entry.url}): ${locales.en.skills[i].description} ${locales.en.skills[i].requirement}`).join('\n')}\n\n## Platform availability\n\n- Claude Code: ${locales.en.claudeStatus}\n- Codex: ${locales.en.codexStatus}\n- ChatGPT: ${locales.en.chatgptStatus}\n- ClawHub: ${locales.en.clawhubStatus}\n\nThis file is a navigation aid generated from the website content, not a separate product specification. Follow the linked repositories for current releases.\n`;
}
