   const StringUtils = {
    removerNaoNumeros(str){
        if(!str) return null;
        return str.replace(/\D/g, '')
    }
   }

   const FormatUtils = {
    
    formatarCpf(cpf) {
        if (cpf.length != 11) return null;
        let numeros_cpf = StringUtils.removerNaoNumeros(cpf)
    },
   }

   
   dayjs.extend(dayjs_plugin_customParseFormat);
   const DateUtils = {
    
        FORMATO_MYSQl: 'YYYY/MM/DD',

        formatar(data){
            if(!data || !dayjs(data).isValid()) return null;
            return dayjs(data).format(this.FORMATO_MYSQl);
        },

        parser(dataStr){
            const data = dayjs(dataStr, this.FORMATO_MYSQl);
            return data.isValid() ? data.toDate() : null;

        },

        calcularIdade(dataNascimento){
            const dataNasc = dayjs(dataNascimento, this.FORMATO_MYSQl) 
            if(!dataNasc.isValid()) return null;
            return dayjs().diff(dataNasc, 'year')
        }

   }

   const ValidUtils = {

   }