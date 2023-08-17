---
title: 数学符号及其对应的LaTeX代码
date: 2023-08-17 11:11:51
updated: 2023-08-17 11:11:51
cover: latex-project-logo.svg
tags:
categories:
---

由于之前写学习笔记时总是不会输入数学符号，这时候就跑到搜索引擎里面去搜索，再复制。索性自己抄写一遍，后续再需要复制可以来这里。

[参考 Art of Problem Solving](https://artofproblemsolving.com/wiki/index.php/LaTeX:Symbols)

## Operators

|Symbol|Command|Symbol|Command|Symbol|Command|
|:-----|:------|:-----|:------|:-----|:------|
|$\pm$|\pm|$\mp$|\mp|$\times$|\times|
|$\div$|\div|$\cdot$|\cdot|$\ast$|\ast|
|$\star$|\star|$\dagger$|\dagger|$\ddagger$|\ddagger|
|$\amalg$|\amalg|$\cap$|\cap|$\cup$|\cup|
|$\uplus$|\uplus|$\sqcap$|\sqcap|$\sqcup$|\sqcup|
|$\vee$|\vee|$\wedge$|\wedge|$\oplus$|\oplus|
|$\ominus$|\ominus|$\otimes$|\otimes|$\circ$|\circ|
|$\bullet$|\bullet|$\diamond$|\diamond|$\lhd$|\lhd|
|$\rhd$|\rhd|$\unlhd$|\unlhd|$\unrhd$|\unrhd|
|$\oslash$|\oslash|$\odot$|\odot|$\bigcirc$|\bigcirc|
|$\triangleleft$|\triangleleft|$\Diamond$|\Diamond|$\bigtriangleup$|\bigtriangleup|
|$\bigtriangledown$|\bigtriangledown|$\Box$|\Box|$\triangleright$|\triangleright|
|$\setminus$|\setminus|$\wr$|\wr|$\sqrt{x}$|\sqrt{x}|
|$x^{\circ}$|x^{\circ}|$\triangledown$|\triangledown|$\sqrt[n]{x}$|\sqrt[n]{x}|
|$a^x$|a^x|$a^{xyz}$|a^{xyz}|$a_x$|a_x|

## Relations

|Symbol|Command|Symbol|Command|Symbol|Command|
|:-----|:------|:-----|:------|:-----|:------|
|$\le$|\le|$\ge$|\ge|$\neq$|\neq|
|$\sim$|\sim|$\ll$|\ll|$\gg$|\gg|
|$\doteq$|\doteq|$\simeq$|\simeq|$\subset$|\subset|
|$\supset$|\supset|$\approx$|\approx|$\asymp$|\asymp|
|$\subseteq$|\subseteq|$\supseteq$|\supseteq|$\cong$|\cong|
|$\smile$|\smile|$\sqsubset$|\sqsubset|$\sqsupset$|\sqsupset|
|$\equiv$|\equiv|$\frown$|\frown|$\sqsubseteq$|\sqsubseteq|
|$\sqsupseteq$|\sqsupseteq|$\propto$|\propto|$\bowtie$|\bowtie|
|$\in$|\in|$\ni$|\ni|$\prec$|\prec|
|$\succ$|\succ|$\vdash$|\vdash|$\dashv$|\dashv|
|$\preceq$|\preceq|$\succeq$|\succeq|$\models$|\models|
|$\perp$|\perp|$\parallel$|\parallel|
|$\mid$|\mid|$\bumpeq$|\bumpeq|

Negations of many of these relations can be formed by just putting \not before the symbol, or by slipping an "n" between the \ and the word. Here are a couple examples, plus many other negations; it works for many of the many others as well.

|Symbol|Command|Symbol|Command|Symbol|Command|
|:-----|:------|:-----|:------|:-----|:------|
|$\nmid$|\nmid|$\nleq$|\nleq|$\ngeq$|\ngeq|
|$\nsim$|\nsim|$\ncong$|\ncong|$\nparallel$|\nparallel|
|$\not<$|\not<|$\not>$|\not>|$\not=$|\not= or \neq or \ne|
|$\not\le$|\not\le|$\not\ge$|\not\ge|$\not\sim$|\not\sim|
|$\not \approx$|\not\approx|$\not\cong$|\not\cong|$\not\equiv$|\not\equiv|
|$\not\parallel$|\not\parallel|$\nless$|\nless|$\ngtr$|\ngtr|
|$\lneq$|\lneq|$\gneq$|\gneq|$\lnsim$|\lnsim|
|$\lneqq$|\lneqq|$\gneqq$|\gneqq|

To use other relations not listed here, such as =, >, and <, in LaTeX, you must use the symbols on your keyboard, as they are not available in $\LaTeX$.

## Greek Letters

### Lowercase Letters

|Symbol|Command|Symbol|Command|Symbol|Command|Symbol|Command|
|:-----|:------|:-----|:------|:-----|:------|:-----|:------|
|$\alpha$|\alpha|$\beta$|\beta|$\gamma$|\gamma|$\delta$|\delta|
|$\epsilon$|\epsilon|$\varepsilon$|\varepsilon|$\zeta$|\zeta|$\eta$|\eta|
|$\theta$|\theta|$\vartheta$|\vartheta|$\iota$|\iota|$\kappa$|\kappa|
|$\lambda$|\lambda|$\mu$|\mu|$\nu$|\nu|$\xi$|\xi|
|$\pi$|\pi|$\varpi$|\varpi|$\rho$|\rho|$\varrho$|\varrho|
|$\sigma$|\sigma|$\varsigma$|\varsigma|$\tau$|\tau|$\upsilon$|\upsilon|
|$\phi$|\phi|$\varphi$|\varphi|$\chi$|\chi|$\psi$|\psi|
|$\omega$|\omega|

### Capital Letters

|Symbol|Command|Symbol|Command|Symbol|Command|Symbol|Command|
|:-----|:------|:-----|:------|:-----|:------|:-----|:------|
|$\Gamma$|\Gamma|$\Delta$|\Delta|$\Theta$|\Theta|$\Lambda$|\Lambda|
|$\Xi$|\Xi|$\Pi$|\Pi|$\Sigma$|\Sigma|$\Upsilon$|\Upsilon|
|$\Phi$|\Phi|$\Psi$|\Psi|$\Omega$|\Omega|

## Arrows

|Symbol|Command|Symbol|Command|
|:-----|:------|:-----|:------|
|$\gets$|\gets|$\to$|\to|
|$\leftarrow$|\leftarrow|$\Leftarrow$|\Leftarrow|
|$\rightarrow$|\rightarrow|$\Rightarrow$|\Rightarrow|
|$\leftrightarrow$|\leftrightarrow|$\Leftrightarrow$|\Leftrightarrow|
|$\mapsto$|\mapsto|$\hookleftarrow$|\hookleftarrow|
|$\leftharpoonup$|\leftharpoonup|$\leftharpoondown$|\leftharpoondown|
|$\rightleftharpoons$|\rightleftharpoons|$\longleftarrow$|\longleftarrow|
|$\Longleftarrow$|\Longleftarrow|$\longrightarrow$|\longrightarrow|
|$\Longrightarrow$|\Longrightarrow|$\longleftrightarrow$|\longleftrightarrow|
|$\Longleftrightarrow$|\Longleftrightarrow|$\longmapsto$|\longmapsto|
|$\hookrightarrow$|\hookrightarrow|$\rightharpoonup$|\rightharpoonup|
|$\rightharpoondown$|\rightharpoondown|$\leadsto$|\leadsto|
|$\uparrow$|\uparrow|$\Uparrow$|\Uparrow|
|$\downarrow$|\downarrow|$\Downarrow$|\Downarrow|
|$\updownarrow$|\updownarrow|$\Updownarrow$|\Updownarrow|
|$\nearrow$|\nearrow|$\searrow$|\searrow|
|$\swarrow$|\swarrow|$\nwarrow$|\nwarrow|
|$\overrightarrow{AB}$|\overrightarrow{AB}|$\overleftarrow{AB}$|\overleftarrow{AB}|
|$\overleftrightarrow{AB}$|\overleftrightarrow{AB}|

(For those of you who hate typing long strings of letters, \iff and \implies can be used in place of \Longleftrightarrow and \Longrightarrow respectively.)

## Dots

|Symbol|Command|Symbol|Command|
|:-----|:------|:-----|:------|
|$\cdot$|\cdot|$\vdots$|\vdots|
|$\dots$|\dots|$\ddots$|\ddots|
|$\cdots$|\cdots|$\iddots$|\iddots|

## Accents

|Symbol|Command|Symbol|Command|Symbol|Command|
|:-----|:------|:-----|:------|:-----|:------|
|$\hat{x}$|\hat{x}|$\check{x}$|\check{x}|$\dot{x}$|\dot{x}|
|$\breve{x}$|\breve{x}|$\acute{x}$|\acute{x}|$\ddot{x}$|\ddot{x}|
|$\grave{x}$|\grave{x}|$\tilde{x}$|\tilde{x}|$\mathring{x}$|\mathring{x}|
|$\bar{x}$|\bar{x}|$\vec{x}$|\vec{x}|

When applying accents to i and j, you can use \imath and \jmath to keep the dots from interfering with the accents:

|Symbol|Command|Symbol|Command|
|:-----|:------|:-----|:------|
|$\vec{\jmath}$|\vec{\jmath}|$\tilde{\imath}$|\tilde{\imath}|

\tilde and \hat have wide versions that allow you to accent an expression:

|Symbol|Command|Symbol|Command|
|:-----|:------|:-----|:------|
|$\widehat{7+x}$|\widehat{7+x}|$\widetilde{abc}$|\widetilde{abc}|

## Others

|Symbol|Command|Symbol|Command|Symbol|Command|
|:-----|:------|:-----|:------|:-----|:------|
|$\infty$|\infty|$\triangle$|\triangle|$\angle$|\angle|
|$\aleph$|\aleph|$\hbar$|\hbar|$\imath$|\imath|
|$\jmath$|\jmath|$\ell$|\ell|$\wp$|\wp|
|$\Re$|\Re|$\Im$|\Im|$\mho$|\mho|
|$\prime$|\prime|$\emptyset$|\emptyset|$\nabla$|\nabla|
|$\surd$|\surd|$\partial$|\partial|$\top$|\top|
|$\bot$|\bot|$\vdash$|\vdash|$\dashv$|\dashv|
|$\forall$|\forall|$\exists$|\exists|$\neg$|\neg|
|$\flat$|\flat|$\natural$|\natural|$\sharp$|\sharp|
|$\backslash$|\backslash|$\Box$|\Box|$\Diamond$|\Diamond|
|$\clubsuit$|\clubsuit|$\diamondsuit$|\diamondsuit|$\heartsuit$|\heartsuit|
|$\spadesuit$|\spadesuit|$\Join$|\Join|$\blacksquare$|\blacksquare|
|$\diamondsuit$|\diamondsuit|$\copyright$|\copyright|$\underarc{XYZ}$|\underarc{XYZ}|
|$\heartsuit$|\heartsuit|$\overarc{ABC}$|\overarc{ABC}|$\cup$|\cup|
|$\S$|\S|$\P$|\P|$\Vdash$|\Vdash|
|$\pounds$|\pounds|$\in$|\in|$\vDash$|\vDash|
|$\bigstar$|\bigstar|$\implies$|\implies|
|$\square$|\square|
|$\smiley$|\smiley|
|$\mathbb{R}$|\mathbb{R} (represents all real numbers)|
|$\checkmark$|\checkmark|
|$\cancer$|\cancer|

Note: $\cancer$ and $\overarc{ABC}$ do not work in the classroom.

## Command Symbols

Some symbols are used in commands, so they need to be treated in a special way.

|Symbol|Command|Symbol|Command|Symbol|Command|Symbol|Command|
|:-----|:------|:-----|:------|:-----|:------|:-----|:------|
|$\textdollar$|\textdollar or \\$|$\&$|\\&|$\%$|\\%|$\#$|\\#|
|$\_$|\\_|$\{$|\\{|$\}$|\\}|$\backslash$|\backslash|

(Warning: Using $ for $\textdollar$ will result in $$. This is a bug as far as we know. Depending on the version of $\LaTeX$ this is not always a problem.)

## European Language Symbols

|Symbol|Command|Symbol|Command|Symbol|Command|Symbol|Command|
|:-----|:------|:-----|:------|:-----|:------|:-----|:------|
|${\oe}$|{\oe}|${\ae}$|{\ae}|${\o}$|{\o}|
|${\OE}$|{\OE}|${\AE}$|{\AE}|${\AA}$|{\AA}|${\O}$|{\O}|
|${\l}$|{\l}|${\ss}$|{\ss}|$\text{!`}$|\!`|
|${\L}$|{\L}|${\SS}$|{\SS}|

## Bracketing Symbols

In mathematics, sometimes we need to enclose expressions in brackets, braces or parentheses. Some of these work just as you'd imagine in LaTeX; type ( and ) for parentheses, [ and ] for brackets, and | and | for absolute value. However, other symbols have special commands:

|Symbol|Command|Symbol|Command|Symbol|Command|
|:-----|:------|:-----|:------|:-----|:------|
|$\{$|\\{|$\}$|\\}|$\|$|\\\|
|$\backslash$|\backslash|$\lfloor$|\lfloor|$\rfloor$|\rfloor|
|$\lceil$|\lceil|$\rceil$|\rceil|$\langle$|\langle|
|$\rangle$|\rangle|

You might notice that if you use any of these to typeset an expression that is vertically large, like

(\frac{a}{x} )^2
the parentheses don't come out the right size:

$$(\frac{a}{x})^2$$
If we put \left and \right before the relevant parentheses, we get a prettier expression:

\left(\frac{a}{x} \right)^2
gives

$$\left(\frac{a}{x} \right)^2$$
For systems of equations or piecewise functions, use the cases environment:

f(x) = \begin{cases} x^2 & x \ge 0 \\ x & x < 0 \end{cases}

which gives

$$f(x) = \begin{cases} x^2 & x \ge 0 \\ x & x < 0 \end{cases}$$

In addition to the \left and \right commands, when doing floor or ceiling functions with fractions, using

\left\lceil\frac{x}{y}\right\rceil

and \left\lfloor\frac{x}{y}\right\rfloor

gives both $\left\lceil\frac{x}{y}\right\rceil$ and $\left\lfloor\frac{x}{y}\right\rfloor$, respectively.


And, if you type this

\underbrace{a_0+a_1+a_2+\cdots+a_n}_{x}

Gives

$$\underbrace{a_0+a_1+a_2+\cdots+a_n}_{x}$$

Or

\overbrace{a_0+a_1+a_2+\cdots+a_n}^{x}

Gives

$$\overbrace{a_0+a_1+a_2+\cdots+a_n}^{x}$$


\left and \right can also be used to resize the following symbols:

|Symbol|Command|Symbol|Command|Symbol|Command|
|:-----|:------|:-----|:------|:-----|:------|
|$\uparrow$|\uparrow|$\downarrow$|\downarrow|$\updownarrow$|\updownarrow|
|$\Uparrow$|\Uparrow|$\Downarrow$|\Downarrow|$\Updownarrow$|\Updownarrow|

## Multi-Size Symbols

Some symbols render differently in inline math mode and in display mode. Display mode occurs when you use \[...\] or $$...$$, or environments like \begin{equation}...\end{equation}, \begin{align}...\end{align}. Read more in the commands section of the guide about how symbols which take arguments above and below the symbols, such as a summation symbol, behave in the two modes.

In each of the following, the two images show the symbol in display mode, then in inline mode.

|Symbol|Command|Symbol|Command|Symbol|Command|
|:-----|:------|:-----|:------|:-----|:------|
|$\sum  \textstyle\sum$|\sum|$\int  \textstyle\int$|\int|$\oint  \textstyle\oint$|\oint|
|$\prod  \textstyle\prod$|\prod|$\coprod  \textstyle\coprod$|\coprod|$\bigcap  \textstyle\bigcap$|\bigcap|
|$\bigcup  \textstyle\bigcup$|\bigcup|$\bigsqcup  \textstyle\bigsqcup$|\bigsqcup|$\bigvee \textstyle\bigvee$|\bigvee|
|$\bigwedge  \textstyle\bigwedge$|\bigwedge|$\bigodot  \textstyle\bigodot$|\bigodot|$\bigotimes \textstyle\bigotimes$|\bigotimes|
|$\bigoplus  \textstyle\bigoplus$|\bigoplus|$\biguplus  \textstyle\biguplus$|\biguplus|
