export class RegUtil {
  static DEFAULT = /(,|\r?\n|\r|^)(?:"([^"]*(?:""[^"]*)*)"|([^",\r\n]*))/gi
  static csv(de = ',', qt = '"') {
    if (de === ',' && qt === '"') return RegUtil.DEFAULT
    const delim = `${de}|\r?\n|\r|^`
    const quote = `[^${qt}]*(?:${qt + qt}[^${qt}]*)*`
    const value = `[^${qt}${de}\r\n]*`
    return new RegExp(`(${ delim })(?:${ qt }(${ quote })${ qt }|(${ value }))`, 'gi')
  }
  static quoteRep(qt) {
    return new RegExp(qt + qt, 'g')
  }
}

// const regexCsv = /(,|\x?\n|\x|^)(?:"([^"]*(?:""[^"]*)*)"|([^",\x\n]*))/gi
