import { defineConfig } from 'vitepress'
import mathjax3 from 'markdown-it-mathjax3';

const customElements = [
	'mjx-container',
    'mjx-assistive-mml',
	'math',
	'maction',
	'maligngroup',
	'malignmark',
	'menclose',
	'merror',
	'mfenced',
	'mfrac',
	'mi',
	'mlongdiv',
	'mmultiscripts',
	'mn',
	'mo',
	'mover',
	'mpadded',
	'mphantom',
	'mroot',
	'mrow',
	'ms',
	'mscarries',
	'mscarry',
	'mscarries',
	'msgroup',
	'mstack',
	'mlongdiv',
	'msline',
	'mstack',
	'mspace',
	'msqrt',
	'msrow',
	'mstack',
	'mstack',
	'mstyle',
	'msub',
	'msup',
	'msubsup',
	'mtable',
	'mtd',
	'mtext',
	'mtr',
	'munder',
	'munderover',
	'semantics',
	'math',
	'mi',
	'mn',
	'mo',
	'ms',
	'mspace',
	'mtext',
	'menclose',
	'merror',
	'mfenced',
	'mfrac',
	'mpadded',
	'mphantom',
	'mroot',
	'mrow',
	'msqrt',
	'mstyle',
	'mmultiscripts',
	'mover',
	'mprescripts',
	'msub',
	'msubsup',
	'msup',
	'munder',
	'munderover',
	'none',
	'maligngroup',
	'malignmark',
	'mtable',
	'mtd',
	'mtr',
	'mlongdiv',
	'mscarries',
	'mscarry',
	'msgroup',
	'msline',
	'msrow',
	'mstack',
	'maction',
	'semantics',
	'annotation',
	'annotation-xml',
];
// https://vitepress.dev/reference/site-config
export default defineConfig({
  head: [["link", { rel: "icon", href: "https://pic.imgdb.cn/item/66fe1b150a206445e3979ffa.png" }]],
  title: "Louis的笔记本",
  description: "A VitePress Site",
  themeConfig: {
    outlineTitle:"目录",
    outline:[2,6],
    logo: 'https://pic.imgdb.cn/item/66fe1b150a206445e3979ffa.png',
    // https://vitepress.dev/reference/default-theme-config
    nav: [
	{text:'导航',link:'/'},
    { text: '科研', items:[
        {text:'机器学习',link: '/机器学习.md'},
        {text:'动手学深度学习',link: '/动手学深度学习.md'},
        {text:'动手学强化学习',link: '/动手学强化学习.md'},
        {text:'图神经网络',link: '/图神经网络.md'},]},
    { text: '工作', items:[
        {text:'算法',link: '/算法.md'}]},
	{ text: '论文阅读', items:[
		{text:'KDD2024:Harvesting Efficient',link:'/KDD2024.md'},
		{text:'KDD2019:Representation Learning',link:'/KDD2019.md'},
		{text:'KDD2021:A Deep Learning Method',link:'/KDD2021.md'},
		{text:'KDD2022:Applying Deep Learning',link:'/KDD2022.md'},]}],
    // sidebar: [
    //   {
    //     text: 'Examples',
    //     items: [
    //       { text: 'Markdown Examples', link: '/markdown-examples' },
    //       { text: 'Runtime API Examples', link: '/api-examples' }
    //     ]
    //   }
    // ],
    sidebar: false, // 关闭侧边栏
    aside: "left", // 设置右侧侧边栏在左侧显示
    socialLinks: [
      { icon: 'github', link: 'https://github.com/RuiXuan-Liu' }
    ],
    footer: {
      copyright: "LRX版权所有 @ 2024-2054 请尊重他人劳动成果，未经允许禁止转载"
    },
       // 设置搜索框的样式
       search: {
        provider: "local",
        options: {
          translations: {
            button: {
              buttonText: "搜索文档",
              buttonAriaLabel: "搜索文档",
            },
            modal: {
              noResultsText: "无法找到相关结果",
              resetButtonTitle: "清除查询条件",
              footer: {
                selectText: "选择",
                navigateText: "切换",
              },
            },
          },
        },
      },
  },
  markdown: {
    config: (md) => {
      md.use(mathjax3);
    },
  },
  vue: {
    template: {
      compilerOptions: {
        isCustomElement: (tag) => customElements.includes(tag),
      },
    },
  }
})


