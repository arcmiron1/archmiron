function $(str: string): HTMLElement | null {
    str = str.trim();
    var r = null;
    if (str == '') return null;
    if (str.includes('#')) return document.getElementById(str.replace(/^(#|\.)/, ''));
    if (str.includes('.')) r = document.getElementsByClassName(str.replace(/^(#|\.)/, ''));
    if (r != null && Array.isArray(r) && r.length > 0) return r[0];
    return null; 
}
