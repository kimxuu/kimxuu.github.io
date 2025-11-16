// ==UserScript==
// @name         彩色粵拼注入
// @namespace    https://kimxuu.github.io
// @version      1.0.0
// @description  Add Cantonese pronunciation (Jyutping) on Chinese characters
// @author       kimxuu
// @match        *://*/*
// @icon         data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>🌈</text></svg>
// @grant        GM_registerMenuCommand
// @grant        GM_unregisterMenuCommand
// @require      https://unpkg.com/to-jyutping@3.1.1/dist/index.js
// ==/UserScript==

(function() {
    'use strict';

    const style = document.createElement('style');
    style.textContent = `
    ruby.inject-jyutping {
        position: relative;
    }

    ruby.inject-jyutping > rt {
        position: relative;
        margin-left: 0.1em;
        margin-right: 0.1em;
        font-size: 0.74em;
        font-variant: initial;
        text-transform: initial;
        letter-spacing: initial;
    }

    ruby.inject-jyutping > rt, rhyme {
        font-family: "Segoe UI", Calibri, Roboto, Arial, Tahoma, Geneva, Verdana, sans-serif !important;
    }

    ruby.inject-jyutping > rt::before {
        content: var(--onset);
        color: #ad7f58;
    }

    rhyme::before {
        content: var(--nucleus);
        color: #05a2c2;
    }

    rhyme::after {
        content: var(--coda);
        color: #889096;
    }

    ruby.inject-jyutping > rt::after {
        content: var(--tone);
        color: #e54d2e;
    }

    rhyme {
        vertical-align: baseline !important;
    }

    .candidates {
        position: absolute;
        bottom: 0;
        left: 0;
        z-index: 9999;
        display: flex;
        flex-direction: column;
        width: auto;
        min-width: 100%;
        background: #fff;
        box-shadow: 0 3px 16px rgba(0, 0, 0, 0.2);
    }

    .candidates:focus {
        outline: none;
    }

    .candidates > span {
        min-width: max-content;
        padding-left: 0.2em;
        padding-right: 0.2em;
        color: #333 !important;
    }

    .candidates > span:hover {
        background: rgba(0, 0, 0, 0.1);
    }

    .ancestor-overflow-visible {
        overflow: visible !important;
    }

    .ytp-caption-window-container > .caption-window {
        left: 1.5% !important;
        right: 1.5% !important;
        width: auto !important;
        margin-left: 0 !important;
    }

    @media print {
        ruby.inject-jyutping > rt {
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
        }
    }
    `;

    function hasHanChar(s) {
        return /[\p{Unified_Ideograph}\u3007]/u.test(s);
    }

    const converter = ToJyutping.customize({
        肮: 'ong1',

        背静: 'bui6 zing6',
        背时: 'bui6 si4',
        // 背书: 'bui6 syu1',
        // 背诵: 'bui6 zung6',
        背兴: 'bui6 hing3',
        背运: 'bui6 wan6',
        背字儿: 'bui6 zi6 ji4',
        // 倒背如流: 'dou3 bui6 jyu4 lau4',
        耳背: 'ji5 bui6',

        一并: 'jat1 bing3',
        合并: 'hap6 bing3',
        吞并: 'tan1 bing3',
        土地兼并: 'tou2 dei6 gim1 bing3',
        并购: 'bing3 kau3',

        萝卜: 'lo4 baak6',
        厂: 'cong2',
        吃饭: 'hek3 faan6',

        斗法: 'dau3 faat3',
        斗富: 'dau3 fu3',
        斗鸡: 'dau3 gai1',
        斗牛: 'dau3 ngau4',
        斗殴: 'dau3 au2',
        斗牌: 'dau3 paai2',
        斗气: 'dau3 hei3',
        斗趣: 'dau3 ceoi3',
        斗士: 'dau3 si6',
        斗眼: 'dau3 ngaan5',
        斗争: 'dau3 zang1',
        斗志: 'dau3 zi3',
        斗智: 'dau3 zi3',
        斗嘴: 'dau3 zeoi2',
        斗口齿: 'dau3 hau2 ci2',
        斗心眼: 'dau3 sam1 ngaan5',

        勾心斗角: 'ngau1 sam1 dau3 gok3',
        钩心斗角: 'ngau1 sam1 dau3 gok3',
        争奇斗艳: 'zang1 kei4 dau3 jim6',
        搏斗: 'bok3 dau3',
        打斗: 'daa2 dau3',
        恶斗: 'ok3 dau3',
        奋斗: 'fan5 dau3',
        格斗: 'gaak3 dau3',
        揪斗: 'zau1 dau3',
        决斗: 'kyut3 dau3',
        角斗: 'gok3 dau3',
        殴斗: 'au2 dau3',
        批斗: 'pai1 dau3',
        械斗: 'haai6 dau3',
        战斗: 'zin3 dau3',
        争斗: 'zang1 dau3',
        窝里斗: 'wo1 leoi5 dau3',
        困兽犹斗: 'kwan3 sau3 jau4 dau3',
        龙争虎斗: 'lung4 zang1 fu2 dau3',
        明争暗斗: 'ming4 zang1 am3 dau3',
        坐山观虎斗: 'zo6 saan1 gun1 fu2 dau3',
        单打独斗: 'daan1 daa2 duk6 dau3',

        儿: 'ji4',

        // 覆
        复电: 'fuk1 din6',
        复函: 'fuk1 haam4',
        复核: 'fuk1 hat6',
        复命: 'fuk1 ming6',
        复信: 'fuk1 seon3',
        复辙: 'fuk1 cit3',
        办复: 'baan6 fuk1',
        答复: 'daap3 fuk1',
        // 反复: 'faan2 fuk1',
        奉复: 'fung6 fuk1',
        批复: 'pai1 fuk1',
        回复: 'wui4 fuk1',

        // 複
        复本: 'fuk1 bun2',
        复查: 'fuk1 caa4',
        复方: 'fuk1 fong1',
        复果: 'fuk1 gwo2',
        复合: 'fuk1 hap6',
        复检: 'fuk1 gim2',
        复句: 'fuk1 geoi3',
        复利: 'fuk1 lei6',
        复评: 'fuk1 ping4',
        复审: 'fuk1 sam2',
        复试: 'fuk1 si3',
        复述: 'fuk1 seot6',
        复数: 'fuk1 sou3',
        复胃: 'fuk1 wai6',
        复习: 'fuk1 zaap6',
        复线: 'fuk1 sin3',
        复写: 'fuk1 se2',
        复姓: 'fuk1 sing3',
        复盐: 'fuk1 jim4',
        复眼: 'fuk1 ngaan5',
        复叶: 'fuk1 jip6',
        复议: 'fuk1 ji5',
        复音: 'fuk1 jam1',
        复印: 'fuk1 jan3',
        复杂: 'fuk1 zaap6',
        复诊: 'fuk1 can2',
        复制: 'fuk1 zai3',
        复分解: 'fuk1 fan1 gaai2',
        复辅音: 'fuk1 fu6 jam1',
        复音词: 'fuk1 jam1 ci4',
        复本位制: 'fuk1 bun2 wai6 zai3',
        // 重复: 'cung4 fuk1',
        繁复: 'faan4 fuk1',
        复式: 'fuk1 sik1',
        复赛: 'fuk1 coi3',

        购: 'kau3',
        柜: 'gwai6',

        划: 'waa4',
        划船: 'waa1 syun4',

        划算: 'faa3 syun3',
        划不着: 'faa3 bat1 zoek6',
        划不来: 'faa3 bat1 loi4',

        划线: 'waak6 sin3',
        划账: 'waak6 zoeng3',
        划破: 'waak6 po3',
        划拳: 'waak6 kyun4',

        划拨: 'waak6 but6',
        划策: 'waak6 caak3',
        划分: 'waak6 fan1',
        划价: 'waak6 gaa3',
        划清: 'waak6 cing1',
        划一: 'waak6 jat1',
        划转: 'waak6 zyun2',
        划时代: 'waak6 si4 doi6',
        划一不二: 'waak6 jat1 bat1 ji6',
        㓦划: 'maak3 waak6',
        摆划: 'baai2 waak6',
        比划: 'bei2 waak6',
        擘划: 'maak3 waak6',
        策划: 'caak3 waak6',
        筹划: 'cau4 waak6',
        规划: 'kwai1 waak6',
        计划: 'gai3 waak6',
        谋划: 'mau4 waak6',
        企划: 'kei5 waak6',
        区划: 'keoi1 waak6',

        坏: 'waai6',
        价: 'gaa3',
        惊: 'geng1',
        据: 'geoi3',
        腊: 'laap6',
        蜡: 'laap6',

        里边: 'leoi5 bin1',
        里带: 'leoi5 daai3',
        里脊: 'leoi5 zek3',
        里间: 'leoi5 gaan1',
        里面: 'leoi5 min6',
        里手: 'leoi5 sau2',
        里首: 'leoi5 sau2',
        里头: 'leoi5 tau4',
        里屋: 'leoi5 uk1',
        里子: 'leoi5 zi2',
        里外里: 'leoi5 ngoi6 leoi5',
        里出外进: 'leoi5 ceot1 ngoi6 zeon3',
        里勾外连: 'leoi5 ngau1 ngoi6 lin4',
        里勾外联: 'leoi5 ngau1 ngoi6 lyun4',
        里急后重: 'leoi5 gap1 hau6 cung5',
        里通外国: 'leoi5 tung1 ngoi6 gwok3',
        // 里应外合: 'leoi5 jing3 ngoi6 hap6',
        山里红: 'saan1 leoi5 hung4',
        胎里素: 'toi1 leoi5 sou3',
        // 窝里斗: 'wo1 leoi5 dau3', 重复
        窝里反: 'wo1 leoi5 faan2',
        窝里横: 'wo1 leoi5 waang4',
        屋里的: 'uk1 leoi5 dik1',
        屋里人: 'uk1 leoi5 jan4',
        雪里蕻: 'syut3 leoi5 hung4',
        百里挑一: 'baak3 leoi5 tiu1 jat1',
        表里如一: 'biu2 leoi5 jyu4 jat1',
        吃里扒外: 'hek3 leoi5 paa4 ngoi6',
        吃里爬外: 'hek3 leoi5 paa4 ngoi6',
        归里包堆: 'gwai1 leoi5 baau1 deoi1',
        花里胡哨: 'faa1 leoi5 wu4 saau3',
        话里有话: 'waa6 leoi5 jau5 waa6',
        家长里短: 'gaa1 coeng4 leoi5 dyun2',
        忙里偷闲: 'mong4 leoi5 tau1 haan4',
        门里出身: 'mun4 leoi5 ceot1 san1',
        绵里藏针: 'min4 leoi5 cong4 zam1',
        皮里阳秋: 'pei4 leoi5 joeng4 cau1',
        曲里拐弯: 'kuk1 leoi5 gwaai2 waan1',
        沙里淘金: 'saa1 leoi5 tou4 gam1',
        雾里看花: 'mou6 leoi5 hon3 faa1',
        笑里藏刀: 'siu3 leoi5 cong4 dou1',
        云里雾里: 'wan4 leoi5 mou6 leoi5',
        // 字里行间: 'zi6 leoi5 hong4 gaan1',
        鸡蛋里挑骨头: 'gai1 daan2 leoi5 tiu1 gwat1 tau4',
        宰相肚里能撑船: 'zoi2 soeng3 tou5 leoi5 nang4 caang3 syun4',

        暗里: 'am3 leoi5',
        被里: 'pei5 leoi5',
        表里: 'biu2 leoi5',
        衬里: 'can3 leoi5',
        底里: 'dai2 leoi5',
        封里: 'fung1 leoi5',
        关里: 'gwaan1 leoi5',
        就里: 'zau6 leoi5',
        明里: 'ming4 leoi5',
        哪里: 'naa5 leoi5',
        那里: 'naa5 leoi5',
        内里: 'noi6 leoi5',
        头里: 'tau4 leoi5',
        心里: 'sam1 leoi5',
        夜里: 'je6 leoi5',
        // 这里: 'ze2 leoi5',
        暗地里: 'am3 dei6 leoi5',
        暗下里: 'am3 haa6 leoi5',
        八下里: 'baat3 haa6 leoi5',
        背地里: 'bui3 dei6 leoi5',
        骨子里: 'gwat1 zi2 leoi5',
        私下里: 'si1 haa6 leoi5',
        四下里: 'sei3 haa6 leoi5',
        鞭辟近里: 'bin1 pik1 gan6 leoi5',
        鞭辟入里: 'bin1 pik1 jap6 leoi5',

        岭: 'leng5',

        // 什么: 'sam6 mo1',
        怎么: 'zam2 mo1',
        // 这么: 'ze2 mo1',
        那么: 'naa5 mo1',
        要么: 'jiu3 mo1',
        '么？': 'mo1  ',

        庙: 'miu2',

        复辟: 'fuk6 bik1',
        辟召: 'bik1 ziu6',
        辟书: 'bik1 syu1',

        扑: 'pok3',
        扑倒: 'puk1 dou2',
        扑街: 'puk1 gaai1',

        仆从: 'buk6 cung4',
        仆妇: 'buk6 fu5',
        仆固: 'buk6 gu3',
        仆仆: 'buk6 buk6',
        仆人: 'buk6 jan4',
        仆役: 'buk6 jik6',
        更仆难数: 'gang3 buk6 naan4 sou3',
        // 前仆后继: 'cin4 fu6 hau6 gai3',
        公仆: 'gung1 buk6',
        奴仆: 'nou4 buk6',

        女仆: 'neoi5 buk6',
        主仆: 'zyu2 buk6',
        仆射: 'buk6 je6',

        纤夫: 'hin1 fu1',
        纤绳: 'hin1 sing2',
        纤手: 'hin1 sau2',
        拉纤: 'laai1 hin1',

        窍: 'hiu3',

        翘课: 'kiu3 fo3',
        翘辫子: 'kiu3 bin1 zi2',
        翘尾: 'kiu3 mei5',

        翘到: 'kiu3 dou3',
        翘的: 'kiu3 dik1',
        翘得: 'kiu3 dak1',
        翘起: 'kiu3 hei2',
        翘了: 'kiu3 liu5',
        翘着: 'kiu3 zoek6',

        洒: 'saa2',

        舍得: 'se2 dak1',
        舍不得: 'se2 bat1 dak1',
        舍脸: 'se2 lim5',
        // 舍命: 'se2 ming6',
        舍弃: 'se2 hei3',
        舍身: 'se2 san1',

        舍去: 'se2 heoi3',

        舍本逐末: 'se2 bun2 zuk6 mut6',
        舍己为公: 'se2 gei2 wai6 gung1',
        舍己为人: 'se2 gei2 wai4 jan4',
        舍近求远: 'se2 gan6 kau4 jyun5',
        舍近图远: 'se2 gan6 tou4 jyun5',
        舍车保帅: 'se2 geoi1 bou2 seoi3',
        // 舍生取义: 'se2 sang1 ceoi2 ji6',
        舍生忘死: 'se2 sang1 mong4 sei2',

        舍我其谁: 'se2 ngo5 kei4 seoi4',

        舍卒保车: 'se2 zeot1 bou2 geoi1',
        难舍难分: 'naan4 se2 naan4 fan1',
        四舍五入: 'sei3 se2 ng5 jap6',
        用舍行藏: 'jung6 se2 hang4 cong4',
        用行舍藏: 'jung6 hang4 se2 cong4',

        割舍: 'got3 se2',
        抛舍: 'paau1 se2',
        取舍: 'ceoi2 se2',
        施舍: 'si1 se2',
        恋恋不舍: 'lyun2 lyun2 bat1 se2',
        难分难舍: 'naan4 fan1 naan4 se2 ',
        锲而不舍: 'kit3 ji4 bat1 se2',
        穷追不舍: 'kung4 zeoi1 bat1 se2',

        依依不舍: 'ji1 ji1 bat1 se2',

        胜: 'sing3',
        // 胜任: 'sing1 jam6',
        // 不胜: 'bat1 sing1',

        // 使馆: 'si3 gun2',
        // 使节: 'si3 zit3',
        使命: 'si3 ming6',
        使团: 'si3 tyun4',
        // 使者: 'si3 ze2',
        出使: 'ceot1 si3',
        大使: 'daai6 si3',
        大使馆: 'daai6 si3 gun2',
        大使館: 'daai6 si3 gun2',
        奉使: 'fung6 si3',
        公使: 'gung1 si3',
        来使: 'loi4 si3',
        // 密使: 'mat6 si3',
        // 特使: 'dak6 si3',
        // 天使: 'tin1 si3',
        信使: 'seon3 si3',
        专使: 'zyun1 si3',
        颐指气使: 'ji4 zi2 hei3 si2',
        頤指氣使: 'ji4 zi2 hei3 si2',
        啱使: 'ngaam1 sai2',

        适: 'sik1',

        松绑: 'sung1 bong2',
        松弛: 'sung1 ci4',
        松动: 'sung1 dung6',
        松缓: 'sung1 wun6',
        松紧: 'sung1 gan2',
        松劲: 'sung1 ging6',
        松口: 'sung1 hau2',
        松快: 'sung1 faai3',
        松气: 'sung1 hei3',
        松软: 'sung1 jyun5',
        松手: 'sung1 sau2',
        松爽: 'sung1 song2',
        松懈: 'sung1 haai6',
        松心: 'sung1 sam1',
        松嘴: 'sung1 zeoi2',
        松松垮垮: 'sung1 sung1 kwaa1 kwaa1',

        松开: 'sung1 hoi1',
        松化: 'sung1 faa3',
        松饼: 'sung1 beng2',
        松脆: 'sung1 ceoi3',
        松一口气: 'sung1 jat1 hau2 hei3',
        松了一口气: 'sung1 liu5 jat1 hau2 hei3',

        放松: 'fong3 sung1',
        干松: 'gon1 sung1',
        宽松: 'fun1 sung1',
        蓬松: 'pung4 sung1',
        // 轻松: 'hing1 sung1',
        鬅松: 'pang4 sung1',
        肉松: 'juk6 sung1',
        手松: 'sau2 sung1',
        疏松: 'so1 sung1',
        酥松: 'sou1 sung1',
        稀松: 'hei1 sung1',
        鱼松: 'jyu4 sung1',
        嘴松: 'zeoi2 sung1',

        听: 'teng1',
        洼: 'waa1',
        袜: 'mat6',
        袜胸: 'mut6 hung1',
        袜腹: 'mut6 fuk1',
        袜肚: 'mut6 tou5',

        吓唬: 'haak3 fu2',
        吓人: 'haak3 jan4',
        杀鸡吓猴: 'saat3 gai1 haak3 hau4',
        恫吓: 'dung6 haak3',
        // 惊吓: 'ging1 haak3',
        恐吓: 'hung2 haak3',
        威吓: 'wai1 haak3',
        吓我: 'haak3 ngo5',
        吓你: 'haak3 nei5',
        吓一跳: 'haak3 jat1 tiu3',
        吓到: 'haak3 dou3',

        须发: 'sou1 faat3',
        须根: 'sou1 gan1',
        须眉: 'sou1 mei4',
        须生: 'sou1 sang1',
        须子: 'sou1 zi2',
        虎须: 'fu2 sou1',
        龙须: 'lung4 sou1',
        溜须拍马: 'lau6 sou1 paak3 maa5',
        触须: 'zuk1 sou1',
        胡须: 'wu4 sou1',
        卷须: 'gyun2 sou1',
        虬须: 'kau4 sou1',
        剃须: 'tai3 sou1',
        八字须: 'baat3 zi6 sou1',

        痒: 'joeng5',
        样: 'joeng6',
        医: 'ji1',

        佣工: 'jung4 gung1',
        佣人: 'jung4 jan4',
        雇佣: 'gu3 jung4',
        帮佣: 'bong1 jung4',
        // 菲佣: 'fei1 jung4',
        女佣: 'neoi5 jung4',

        吁请: 'jyu6 cing2',
        吁求: 'jyu6 kau4',
        呼吁: 'fu1 jyu6',

        郁愤: 'wat1 fan5',
        郁积: 'wat1 zik1',
        郁结: 'wat1 git3',
        郁闷: 'wat1 mun6',
        郁热: 'wat1 jit6',
        郁悒: 'wat1 jap1',
        郁金香: 'wat1 gam1 hoeng1',

        郁郁苍苍: 'wat1 wat1 cong1 cong1',
        郁郁葱葱: 'wat1 wat1 cung1 cung1',

        郁南: 'wat1 naam4',

        抑郁: 'jik1 wat1',
        忧郁: 'jau1 wat1',
        躁郁: 'cou3 wat1',

        苍郁: 'cong1 wat1',
        沉郁: 'cam4 wat1',
        葱郁: 'cung1 wat1',
        怫郁: 'fat6 wat1',
        蓊郁: 'jung2 wat1',
        阴郁: 'jam1 wat1',

        跃: 'joek3',

        脏腑: 'zong6 fu2',
        脏器: 'zong6 hei3',
        膵脏: 'seoi6 zong6',
        肺脏: 'fai3 zong6',
        肝脏: 'gon1 zong6',
        内脏: 'noi6 zong6',
        脾脏: 'pei4 zong6',
        肾脏: 'san6 zong6',
        五脏: 'ng5 zong6',
        心脏: 'sam1 zong6',
        胰脏: 'ji4 zong6',

        折本: 'sit6 bun2',
        折秤: 'sit6 cing3',
        折耗: 'sit6 hou3',
        亏折: 'kwai1 sit6',

        折尺: 'zip3 cek3',
        折叠: 'zip3 dip6',
        折扇: 'zip3 sin3',
        折纸: 'zip3 zi2',
        折皱: 'zip3 zau3',
        折子: 'zip3 zi2',
        存折: 'cyun4 zip3',
        奏折: 'zau3 zip3',
        折痕: 'zip3 han4',

        症结: 'zing1 git3',

        只身: 'zek3 san1',
        只言片语: 'zek3 jin4 pin3 jyu5',
        别具只眼: 'bit6 geoi6 zek3 ngaan5',
        独具只眼: 'duk6 geoi6 zek3 ngaan5',
        片言只语: 'pin3 jin4 zek3 jyu5',
        片言只字: 'pin3 jin4 zek3 zi6',
        片纸只字: 'pin3 zi2 zek3 zi6',
        形只影单: 'jing4 zek3 jing2 daan1',
        船只: 'syun4 zek3',
        舰只: 'laam6 zek3',
        艇只: 'teng5 zek3',
        形单影只: 'jing4 daan1 jing2 zek3',

        一只: 'jat1 zek3',
        二只: 'ji6 zek3',
        两只: 'loeng5 zek3',
        三只: 'saam1 zek3',
        四只: 'sei3 zek3',
        五只: 'ng5 zek3',
        六只: 'luk6 zek3',
        七只: 'cat1 zek3',
        八只: 'baat3 zek3',
        九只: 'gau2 zek3',
        十只: 'sap6 zek3',
        百只: 'baak3 zek3',
        千只: 'cin1 zek3',
        万只: 'maan6 zek3',
        亿只: 'jik1 zek3',
        兆只: 'siu6 zek3',

        种: 'zung2',

        种地: 'zung3 dei6',
        种痘: 'zung3 dau2',
        // 种花: 'zung3 faa1',
        种田: 'zung3 tin4',
        // 种牙: 'zung3 ngaa4',
        // 种植: 'zung3 zik6',
        种牛痘: 'zung3 ngau4 dau2',
        种瓜得瓜: 'zung3 gwaa1 dak1 gwaa1',
        种豆得豆: 'zung3 dau2 dak1 dau2',
        广种薄收: 'gwong2 zung3 bok6 sau1',
        复种: 'fuk6 zung3',
        // 耕种: 'gaang1 zung3',
        伙种: 'fo2 zung3',
        家种: 'gaa1 zung3',
        // 接种: 'zip3 zung3',
        垦种: 'han2 zung3',
        芒种: 'mong4 zung3',
        抢种: 'coeng2 zung3',
        套种: 'tou3 zung3',
        裁种: 'zoi1 zung3',
        刀耕火种: 'dou1 gaang1 fo2 zung3',

        达: 'daat6',

        断: 'tyun5',

        断案: 'dyun3 on3',
        // 断定: 'dyun3 ding6',
        断断: 'dyun3 dyun3',
        断乎: 'dyun3 fu4',
        断然: 'dyun3 jin4',
        断言: 'dyun3 jin4',
        断语: 'dyun3 jyu5',
        断狱: 'dyun3 juk6',
        识文断字: 'sik1 man4 dyun3 zi6',
        裁断: 'coi4 dyun3',
        独断: 'duk6 dyun3',
        果断: 'gwo2 dyun3',
        决断: 'kyut3 dyun3',
        论断: 'leon6 dyun3',
        明断: 'ming4 dyun3',
        判断: 'pun3 dyun3',
        评断: 'ping4 dyun3',
        推断: 'teoi1 dyun3',
        妄断: 'mong5 dyun3',
        武断: 'mou5 dyun3',
        臆断: 'jik1 dyun3',
        预断: 'jyu6 dyun3',
        诊断: 'can2 dyun3',
        专断: 'zyun1 dyun3',
        当机立断: 'dong1 gei1 laap6 dyun3',
        多谋善断: 'do1 mau4 sin6 dyun3',
        优柔寡断: 'jau1 jau4 gwaa2 dyun3',
        断无此理: 'dyun3 mou4 ci2 lei5',
        断无此事: 'dyun3 mou4 ci2 si6',
        当断不断: 'dong1 dyun3 bat1 dyun3',

        会: 'wui5',

        几曾: 'gei2 cang4',
        几多: 'gei2 do1',
        几何: 'gei2 ho4',
        几经: 'gei2 ging1',
        几儿: 'gei2 ji4',
        几时: 'gei2 si4',
        几许: 'gei2 heoi2',
        几次: 'gei2 ci3',
        曾几何时: 'cang4 gei2 ho4 si4',
        大几: 'daai6 gei2',
        好几: 'hou2 gei2',
        老几: 'lou5 gei2',
        未几: 'mei6 gei2',
        无几: 'mou4 gei2',
        不知凡几: 'bat1 zi1 faan4 gei2',

        第几: 'dai6 gei2',
        几个: 'gei2 go3',
        几十: 'gei2 sap6',
        十几: 'sap6 gei2',
        几百: 'gei2 baak3',
        几千: 'gei2 cin1',
        几万: 'gei2 maan6',
        几亿: 'gei2 jik1',
        几兆: 'gei2 siu6',

        几元: 'gei2 jyun4',
        几块: 'gei2 faai3',
        几角: 'gei2 gok3',
        几毛: 'gei2 mou4',
        几分: 'gei2 fan1',
        几成: 'gei2 sing4',
        几倍: 'gei2 pui5',
        分之几: 'fan6 zi1 gei2',

        几克: 'gei2 hak1',
        几吨: 'gei2 deon1',
        几两: 'gei2 loeng5',
        几斤: 'gei2 gan1',
        几公斤: 'gei2 gung1 gan1',

        几毫: 'gei2 hou4',
        几厘: 'gei2 lei4',
        几米: 'gei2 mai1',
        几寸: 'gei2 cyun3',
        几尺: 'gei2 cek3',
        几丈: 'gei2 zoeng6',
        几里: 'gei2 lei5',
        几平方: 'gei2 ping4 fong1',
        几亩: 'gei2 mau5',
        几顷: 'gei2 king2',
        几公顷: 'gei2 gung1 king2',

        几年: 'gei2 nin4',
        几岁: 'gei2 seoi3',
        几月: 'gei2 jyut6',
        几日: 'gei2 jat6',
        几天: 'gei2 tin1',
        几点: 'gei2 dim2',
        几小时: 'gei2 siu2 si4',
        几秒: 'gei2 miu5',
        几夜: 'gei2 je6',
        几轮: 'gei2 leon4',
        几回: 'gei2 wui4',
        几遍: 'gei2 pin3',
        几趟: 'gei2 tong3',

        几位: 'gei2 wai2',
        几人: 'gei2 jan4',
        几口: 'gei2 hau2',
        // 几名: 'gei2 ming4',
        几户: 'gei2 wu6',
        几家: 'gei2 gaa1',
        几所: 'gei2 so2',
        几间: 'gei2 gaan1',
        几员: 'gei2 jyun4',
        几辈: 'gei2 bui3',
        几代: 'gei2 doi6',

        几辆: 'gei2 loeng2',
        几架: 'gei2 gaa3',
        几座: 'gei2 zo6',
        几条: 'gei2 tiu4',
        几只: 'gei2 zek3',
        几头: 'gei2 tau4',
        几匹: 'gei2 pat1',
        几件: 'gei2 gin6',
        几本: 'gei2 bun2',
        几张: 'gei2 zoeng1',
        几页: 'gei2 jip6',
        几封: 'gei2 fung1',
        几瓶: 'gei2 ping4',
        几杯: 'gei2 bui1',
        几碗: 'gei2 wun2',
        几盘: 'gei2 pun4',
        几枚: 'gei2 mui4',
        几颗: 'gei2 fo2',
        几粒: 'gei2 nap1',
        几朵: 'gei2 do2',
        几棵: 'gei2 fo2',
        几枝: 'gei2 zi1',
        几根: 'gei2 gan1',
        几把: 'gei2 baa2',
        几双: 'gei2 soeng1',
        几对: 'gei2 deoi3',

        几部: 'gei2 bou6',
        几句: 'gei2 geoi3',
        几种: 'gei2 zung2',
        几瓣: 'gei2 faan6',
        几桌: 'gei2 coek3',
        几面: 'gei2 min6',
        几层: 'gei2 cang4',
        // 几下: 'gei2 haa5',
        几方: 'gei2 fong1',
        几款: 'gei2 fun2',
        几片: 'gei2 pin3',
        几节: 'gei2 zit3',
        几项: 'gei2 hong6',
        几幅: 'gei2 fuk1',
        几道: 'gei2 dou6',
        几车: 'gei2 ce1',
        几着: 'gei2 ziu1',
        几关: 'gei2 gwaan1',
        几丛: 'gei2 cung4',
        几箱: 'gei2 soeng1',
        几声: 'gei2 seng1',
        几步: 'gei2 bou6',
        几起: 'gei2 hei2',
        几样: 'gei2 joeng6',
        几滴: 'gei2 dik6',
        几处: 'gei2 cyu3',
        几段: 'gei2 dyun6',
        几篇: 'gei2 pin1',
        几股: 'gei2 gu2',
        几份: 'gei2 fan6',
        几拨: 'gei2 but6',
        几笔: 'gei2 bat1',
        几组: 'gei2 zou2',
        几床: 'gei2 cong4',
        几路: 'gei2 lou6',
        几首: 'gei2 sau2',
        几支: 'gei2 zi1',
        几排: 'gei2 paai4',
        几门: 'gei2 mun4',
        几台: 'gei2 toi4',
        几鞭: 'gei2 bin1',
        几枪: 'gei2 coeng1',
        几针: 'gei2 zam1',
        几套: 'gei2 tou3',
        几手: 'gei2 sau2',
        几桩: 'gei2 zong1',
        几株: 'gei2 zyu1',
        几等: 'gei2 dang2',
        几顿: 'gei2 deon6',
        几镐: 'gei2 gou2',
        几场: 'gei2 coeng4',
        几扇: 'gei2 sin3',

        乐池: 'ngok6 ci4',
        乐府: 'ngok6 fu2',
        乐感: 'ngok6 gam2',
        乐歌: 'ngok6 go1',
        乐律: 'ngok6 leot6',
        乐清: 'ngok6 cing1',
        乐舞: 'ngok6 mou5',
        乐音: 'ngok6 jam1',
        乐正: 'ngok6 zing3',
        杵乐: 'cyu5 ngok6',
        国乐: 'gwok3 ngok6',
        军乐: 'gwan1 ngok6',
        民乐: 'man4 ngok6',
        南乐: 'naam4 ngok6',
        器乐: 'hei3 ngok6',
        西乐: 'sai1 ngok6',
        十番乐: 'sap6 faan1 ngok6',
        室内乐: 'sat1 noi6 ngok6',

        离: 'lei4',
        宁: 'ning4',
        为: 'wai6',
        韦: 'wai5',
        贼: 'caak6',

        渍: 'zik1',
        赢: 'jeng4',
        戆: 'ngong6',

        涨: 'zoeng3',

        涨价: 'zoeng2 gaa3',
        涨潮: 'zoeng2 ciu4',

        轻: 'heng1',
        链: 'lin2',
        档: 'dong3',
        扩: 'kwong3',
        矿: 'kwong3',
        虮: 'gei2',
        硖: 'haap6',
        钱: 'cin2',
        尴: 'gaam3',
        蒋: 'zoeng2',

        缕: 'lau5',
        褛: 'lau1',

        箓: 'luk6',
        绳: 'sing2',
        瘫: 'taan2',
        鸽: 'gaap2',
        鹑: 'ceon1',

        纸鹞: 'zi2 jiu2',

        柠: 'ning2',
        妪: 'jyu2',

        船坞: 'syun4 ou3',

        呒: 'mou5',
        濒: 'pan4',
        垫: 'din3',
        请: 'ceng2',
        缜: 'can2',
        蕴: 'wan5',
        肾: 'san6',

        捞: 'lou1',
        钉: 'deng1',
        铤: 'ting5',
        锯: 'goe3',
        茎: 'ging3',
        㖞: 'wo3',

        涌潮: 'jung2 ciu4',
        涌动: 'jung2 dung6',
        涌流: 'jung2 lau4',
        涌现: 'jung2 jin6',
        奔涌: 'ban1 jung2',
        潮涌: 'ciu4 jung2',
        翻涌: 'faan1 jung2',
        管涌: 'gun2 jung2',
        喷涌: 'pan3 jung2',
        泉涌: 'cyun4 jung2',
        腾涌: 'tang4 jung2',
        汹涌: 'hung1 jung2',
        风起云涌: 'fung1 hei2 wan4 jung2',

        韵: 'wan5',

        占比: 'zim3 bei2',
        占据: 'zim3 geoi3',
        占领: 'zim3 ling5',
        占先: 'zim3 sin1',
        占线: 'zim3 sin3',
        占用: 'zim3 jung6',
        占优: 'zim3 jau1',
        占有: 'zim3 jau5',
        占便宜: 'zim3 pin4 ji4',
        独占鳌头: 'duk6 zim3 ngou4 tau4',
        独占资本: 'duk6 zim3 zi1 bun2',
        鸠占鹊巢: 'kau1 zim3 zoek3 caau4',
        霸占: 'baa3 zim3',
        独占: 'duk6 zim3',
        攻占: 'gung1 zim3',
        挤占: 'zai1 zim3',
        进占: 'zeon3 zim3',
        口占: 'hau2 zim3',
        强占: 'koeng4 zim3',
        抢占: 'coeng2 zim3',
        侵占: 'cam1 zim3',
        圈占: 'hyun1 zim3',
        贪占: 'taam1 zim3',
        吞占: 'tan1 zim3',
        袭占: 'zaap6 zim3',
        鹊巢鸠占: 'zoek3 caau4 kau1 zim3'
    });

    const syllableStructureRegex = /^([gk]w?|ng|[bpmfdtnlhwzcsj]?)(?![1-6]?$)(aa?|oe?|eo?|y?u|i|ng|m)(ng|[iumnptk]?)([1-6]?)$/;
    const toneReplacements = {
        1: 'ˉ¹',
        2: '´²',
        3: '-³',
        4: 'ˎ₄',
        5: 'ˏ₅',
        6: 'ˍ₆'
    };

    function parseSyllable(syllable) {
        const [, onset = '', nucleus = '', coda = '', tone = ''] = syllableStructureRegex.exec(syllable) || [];
        const contouredTone = toneReplacements[tone] || tone;
        return `--onset: '${onset}'; --nucleus: '${nucleus}'; --coda: '${coda}'; --tone: '${contouredTone}';`;
    }

    function makeRuby(ch, pronunciation) {
        const ruby = document.createElement('ruby');
        ruby.classList.add('inject-jyutping');
        ruby.textContent = ch;

        pronunciation.split(/\W+/).forEach(syllable => {
            const rt = document.createElement('rt');
            rt.style.cssText = parseSyllable(syllable);
            rt.appendChild(document.createElement('rhyme'));
            ruby.appendChild(rt);
        });

        return ruby;
    }

    async function convertText(node) {
        const conversionResults = converter.getJyutpingList(node.nodeValue || '');
        const newNode = document.createElement('annotated-text');
        for (const [k, v] of conversionResults) {
            newNode.appendChild(v === null ? document.createTextNode(k) : makeRuby(k, v));
        }
        if (node.isConnected) {
            node.parentNode?.replaceChild(newNode, node);
        }
    }

    function forEachText(node, callback) {
        if (node.nodeType === Node.TEXT_NODE) {
            if (node.parentNode.closest('ruby')) return;
            if (hasHanChar(node.nodeValue || '')) {
                callback(node);
            }
        } else if (node.nodeType === Node.ELEMENT_NODE) {
            if (['RUBY', 'OPTION', 'TEXTAREA', 'SCRIPT', 'STYLE'].includes(node.nodeName)) return;
            for (const child of node.childNodes) {
                forEachText(child, callback);
            }
        }
    }

    const mo = new MutationObserver(changes => {
        for (const change of changes) {
            for (const node of change.addedNodes) {
                setTimeout(() => forEachText(node, convertText), 50);
            }
        }
    });

    function closePopup(popup) {
        for (let el = popup.parentElement; el; el = el.parentElement) {
            el.classList.remove('ancestor-overflow-visible');
        }
        requestAnimationFrame(() => popup.remove());
    }

    async function onRubyClick(e) {
        const target = e.target.closest('.inject-jyutping');
        if (!target) return;

        const rt = target.querySelector('rt');
        if (!rt || rt.querySelector('.candidates')) return;

        const keyword = target.textContent.trim()[0];
        const candidates = ToJyutping.getJyutpingCandidates(keyword)[0][1];

        const popup = document.createElement('div');
        popup.className = 'candidates';
        popup.tabIndex = -1;
        candidates.forEach(cand => {
            const span = document.createElement('span');
            span.textContent = cand;
            popup.appendChild(span);
        });

        rt.appendChild(popup);
        popup.focus();

        let count = 0;
        for (let el = target.parentElement.parentElement; el && count <= 10; el = el.parentElement, count++) {
            const cs = window.getComputedStyle(el);
            if (cs.overflow === 'hidden') {
                el.classList.add('ancestor-overflow-visible');
            }
        }

        popup.addEventListener('click', e => {
            if (e.target.tagName !== 'SPAN') return;
            e.stopPropagation();
            const pronunciation = e.target.textContent;
            rt.style.cssText = parseSyllable(pronunciation);
            closePopup(popup);
        });

        popup.addEventListener('blur', () => closePopup(popup));
    }

    function init() {
        document.head.appendChild(style);
        forEachText(document.body, convertText);
        setTimeout(() => {
            mo.observe(document.body, {
                characterData: true,
                childList: true,
                subtree: true,
            });
            document.addEventListener('click', onRubyClick);
        }, 1000);
    }

/*
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
*/

    const hideStyle = document.createElement('style');
    hideStyle.textContent = `ruby.inject-jyutping > rt { display: none; }`;

    function registerStartMenu() {
        let startMenu = GM_registerMenuCommand('🎯 開始', () => {
            GM_unregisterMenuCommand(startMenu);

            hideStyle.remove();
            init();

            registerStopMenu();
        }, {
            accessKey: 'S',
            title: '點擊或按 S 鍵顯示粵拼'
        });
    }

    function registerStopMenu() {
        let stopMenu = GM_registerMenuCommand('🛑 停止', () => {
            GM_unregisterMenuCommand(stopMenu);

            document.head.appendChild(hideStyle);
            mo.disconnect();
            document.removeEventListener('click', onRubyClick);

            registerStartMenu();
        }, {
            accessKey: 'S',
            title: '點擊或按 S 鍵隱藏粵拼'
        });
    }

    registerStartMenu();
})();
