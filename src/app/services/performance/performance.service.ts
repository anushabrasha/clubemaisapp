import { Injectable } from '@angular/core';
import { Events } from '@ionic/angular';

import { DataHolderService } from '../dataHolder/data-holder.service';

import * as moment from 'moment';

@Injectable({
  providedIn: 'root'
})
export class PerformanceService {

  constructor(
    private events: Events,
    private dataCtrl: DataHolderService,
  ) { }


  mapUserMonthlyDetail(userDashboardData, broadCastToken) {
    if (!Object.keys(userDashboardData).length) {
      return false;
    }

    userDashboardData.forEach(element => {
      if (element.role == 'almoxarife') {
        this.setAlmoxarifeData(element.report, broadCastToken);
      } else if (element.role == 'supervisor_de_televendas') {
        this.setSuperfisorTelevendasData(element.report, broadCastToken);
      } else if (element.role == 'supervisor_de_vendas') {
        this.setSupervisorDeVendasData(element.report, broadCastToken);
      } else if (element.role == 'supervisor_tcnico') {
        this.setSupervisorTecnicoData(element.report, broadCastToken);
      } else if (element.role == 'tecnico') {
        this.setTecnicoData(element.report, broadCastToken);
      } else if (element.role == 'torre') {
        this.setTorreData(element.report, broadCastToken);
      } else if (element.role == 'televendas') {
        this.setTelevendasData(element.report, broadCastToken);
      } else if (element.role == 'vendedor') {
        this.setVendedorData(element.report, broadCastToken);
      } else if (element.role == 'vendedor_interno') {
        this.setVendadorInternoData(element.report, broadCastToken);
      } else if (element.role == 'almoxarife_distribuidor') {
        this.setAlmoxarifeDistribuidorData(element.report, broadCastToken);
      } else if (element.role == 'torre_distribuidor') {
        this.setTorreDistribuidorData(element.report, broadCastToken);
      } else if (element.role == 'supervisor_vendas_distribuidor') {
        this.setSupervisorDeVendasDistribuidorData(element.report, broadCastToken);
      } else if (element.role == 'gerente_distribuidor') {
        this.setGerenteDistribuidorData(element.report, broadCastToken);
      } else if (element.role == 'multiplicador_elsys') {
        this.setMultiplicadorElsysData(element.report, broadCastToken);
      } else if (element.role == 'proprietario_elsys') {
        this.setProprietarioElsysData(element.report, broadCastToken);
      } else {

      }
    });
  }

  setAlmoxarifeData(report, broadCastToken) {
    if (!report.length) {
      return false;
    }
    //'consumo excessivo pdv'
    let viewTitle = ['qtde serviços pdv', 'sucesso de retiradas (%)', 'total de pontos'];
    let finalStructure = [];
    let reportList = report;
    let totalPoints = 0;
    let totalServicos = 0;

    let firstStructureList = [];
    let secondStructureList = [];
    let thirdStructureList = [];
    let totalStructureList = [];

    reportList.forEach(element => {
      let points = parseInt(element.total_de_pontos);
      if (points > totalPoints) {
        totalPoints = points;
      }
      let servicos = parseInt(element.Volume_Servicos_PDV);
      if (servicos > totalServicos) {
        totalServicos = servicos;
      }
    });

    reportList.forEach((element, index) => {
      if (index < 3) {
        let date = element.Data_Apuracao ? element.Data_Apuracao : element.DATA_APURACAO;
        let momentMonth: any = moment(date).format('M');
        let currentMonthValue = momentMonth - 1;

        let currentMonth = this.dataCtrl.monthArray[currentMonthValue];
        var serviceBarChartData = (element.Volume_Servicos_PDV * 100 / totalServicos);
        if (serviceBarChartData > 100) {
          serviceBarChartData = 100;
        }
        serviceBarChartData.toFixed(0);

        var revisitBarChartData: any = parseFloat(element.Baixa_De_Material);
        revisitBarChartData *= 100;
        revisitBarChartData = revisitBarChartData.toFixed(2);

        var connectionsChartData = element.Consumo_De_Material * 100;
        connectionsChartData.toFixed(0);

        var totalChartData = (element.total_de_pontos * 100 / totalPoints);
        if (totalChartData > 100) {
          totalChartData = 100;
        }
        totalChartData.toFixed(0);

        let firstStructure = {
          month: currentMonth,
          total: serviceBarChartData.toFixed(2) + '%',
          value: parseFloat(this.ptBrNumberFormat(element.Volume_Servicos_PDV, false)).toFixed(0),
        };

        let secondStructure = {
          month: currentMonth,
          total: revisitBarChartData + '%',
          value: revisitBarChartData + '%',
        };

        let thirdStructure = {
          month: currentMonth,
          total: connectionsChartData.toFixed(0) + '%',
          value: connectionsChartData.toFixed(0) + '%',
        };

        let totalStructure = {
          month: currentMonth,
          total: totalChartData.toFixed(2) + '%',
          value: this.ptBrNumberFormat(element.total_de_pontos, false),
        };


        firstStructureList.push(firstStructure);
        secondStructureList.push(secondStructure);
        thirdStructureList.push(thirdStructure);
        totalStructureList.push(totalStructure);
      }
    });
    finalStructure.push(firstStructureList.reverse());
    finalStructure.push(secondStructureList.reverse());
    //finalStructure.push(thirdStructureList.reverse());
    finalStructure.push(totalStructureList.reverse());
    let data = {
      title: viewTitle,
      report: finalStructure
    };
    this.publishCustomEvent(broadCastToken, data);
  }

  setSuperfisorTelevendasData(report, broadCastToken) {
    if (!report.length) {
      return false;
    }
    let viewTitle = ['qtde de vendas', '% 1ª FATURA PAGA - pdv', '2ª recarga pdv (% )', 'total de pontos'];

    let finalStructure = [];
    let reportList = report;
    let totalPoints = 0;
    let totalVendasPdv = 0;

    let firstStructureList = [];
    let secondStructureList = [];
    let thirdStructureList = [];
    let totalStructureList = [];

    reportList.forEach(element => {
      let pontos = parseInt(element.Total_De_Pontos);
      if (pontos > totalPoints) {
        totalPoints = pontos;
      }
      let vendas = parseInt(element.Vendas_Total_PDV);
      if (vendas > totalVendasPdv) {
        totalVendasPdv = vendas;
      }
    });

    reportList.forEach((element, index) => {
      if (index < 3) {
        let date = element.Data_Apuracao ? element.Data_Apuracao : element.DATA_APURACAO;
        let momentMonth: any = moment(date).format('M');
        let currentMonthValue = momentMonth - 1;

        let currentMonth = this.dataCtrl.monthArray[currentMonthValue];
        var serviceBarChartData: any = (element.Vendas_Total_PDV * 100 / totalVendasPdv);
        if (serviceBarChartData > 100) {
          serviceBarChartData = 100;
        }
        serviceBarChartData = serviceBarChartData.toFixed(0);
        var revisitBarChartData: any = element.P2_PDV ? parseFloat(element.P2_PDV) : 0;
        revisitBarChartData *= 100;
        revisitBarChartData = revisitBarChartData.toFixed(0);

        var connectionsChartData: any = element.Recarga_PDV ? parseFloat(element.Recarga_PDV) : 0;
        connectionsChartData *= 100;
        if (connectionsChartData > 100) {
          connectionsChartData = 100;
        }

        connectionsChartData = connectionsChartData.toFixed(0);


        var totalChartData: any = element.Total_De_Pontos ? (element.Total_De_Pontos * 100 / totalPoints) : 0;
        if (totalChartData > 100) {
          totalChartData = 100;
        }
        totalChartData = totalChartData.toFixed(0);

        let firstStructure = {
          month: currentMonth,
          total: serviceBarChartData + '%',
          value: this.ptBrNumberFormat(element.Vendas_Total_PDV, false),
        };

        let secondStructure = {
          month: currentMonth,
          total: revisitBarChartData + '%',
          value: revisitBarChartData + '%',
        };

        let thirdStructure = {
          month: currentMonth,
          total: connectionsChartData + '%',
          value: connectionsChartData + '%',
        };

        let totalStructure = {
          month: currentMonth,
          total: totalChartData + '%',
          value: this.ptBrNumberFormat(element.Total_De_Pontos, false),
        };
        firstStructureList.push(firstStructure);
        secondStructureList.push(secondStructure);
        thirdStructureList.push(thirdStructure);
        totalStructureList.push(totalStructure);
      }
    });

    finalStructure.push(firstStructureList.reverse());
    finalStructure.push(secondStructureList.reverse());
    finalStructure.push(thirdStructureList.reverse());
    finalStructure.push(totalStructureList.reverse());

    let data = {
      title: viewTitle,
      report: finalStructure
    };
    this.publishCustomEvent(broadCastToken, data);
  }

  setSupervisorDeVendasData(report, broadCastToken) {
    if (!report.length) {
      return false;
    }

    let viewTitle = ['qtde de vendas', '% 1ª FATURA PAGA - pdv', '2ª recarga pdv (% )', 'total de pontos'];
    let finalStructure = [];
    let reportList = report;
    let totalPoints = 0;
    let totalVendasPdv = 0;

    let firstStructureList = [];
    let secondStructureList = [];
    let thirdStructureList = [];
    let totalStructureList = [];

    reportList.forEach(element => {
      let pontos = parseInt(element.Total_De_Pontos);
      if (pontos > totalPoints) {
        totalPoints = pontos;
      }
      let vendas = parseInt(element.Vendas_Total_PDV);
      if (vendas > totalVendasPdv) {
        totalVendasPdv = vendas;
      }
    });

    reportList.forEach((element, index) => {
      if (index < 3) {
        let date = element.Data_Apuracao ? element.Data_Apuracao : element.DATA_APURACAO;
        let momentMonth: any = moment(date).format('M');
        let currentMonthValue = momentMonth - 1;

        let currentMonth = this.dataCtrl.monthArray[currentMonthValue];
        var serviceBarChartData = (element.Vendas_Total_PDV * 100 / totalVendasPdv);
        if (serviceBarChartData > 100) {
          serviceBarChartData = 100;
        }
        serviceBarChartData.toFixed(0);

        var revisitBarChartData: any = parseFloat(element.P2_PDV);
        revisitBarChartData *= 100;

        var connectionsChartData = parseFloat(element.Recarga_PDV);
        connectionsChartData *= 100;
        if (connectionsChartData > 100) {
          connectionsChartData = 100;
        }
        connectionsChartData.toFixed(0);

        var totalChartData = (element.Total_De_Pontos * 100 / totalPoints);
        if (totalChartData > 100) {
          totalChartData = 100;
        }
        totalChartData.toFixed(0);


        let firstStructure = {
          month: currentMonth,
          total: serviceBarChartData.toFixed(2) + '%',
          value: this.ptBrNumberFormat(element.Vendas_Total_PDV, false),
        };

        let secondStructure = {
          month: currentMonth,
          total: revisitBarChartData + '%',
          value: revisitBarChartData.toFixed(2) + '%',
        };

        let thirdStructure = {
          month: currentMonth,
          total: connectionsChartData + '%',
          value: connectionsChartData,
        };

        let totalStructure = {
          month: currentMonth,
          total: totalChartData.toFixed(2) + '%',
          value: this.ptBrNumberFormat(element.Total_De_Pontos, false),
        };

        firstStructureList.push(firstStructure);
        secondStructureList.push(secondStructure);
        thirdStructureList.push(thirdStructure);
        totalStructureList.push(totalStructure);
      }
    });
    finalStructure.push(firstStructureList.reverse());
    finalStructure.push(secondStructureList.reverse());
    finalStructure.push(thirdStructureList.reverse());
    finalStructure.push(totalStructureList.reverse());
    let data = {
      title: viewTitle,
      report: finalStructure
    };
    this.publishCustomEvent(broadCastToken, data);
  }

  setSupervisorTecnicoData(report, broadCastToken) {
    let viewTitle = ['quantidade de serviços pdv', 'REVISITA (%)', 'total de pontos'];
    let finalStructure = [];
    let reportList = report;
    let totalPoints = 0;
    let totalServicos = 0;
    let totalRevesta = 0;

    let firstStructureList = [];
    let secondStructureList = [];
    let totalStructureList = [];

    reportList.forEach(element => {
      let pontos = parseInt(element.Total_De_Pontos);
      if (pontos > totalPoints) {
        totalPoints = pontos;
      }
      let servicos = parseInt(element.VOLUME_SERVICOS);
      if (servicos > totalServicos) {
        totalServicos = servicos;
      }
      let revesta = parseFloat(element.REVISITA) * 100;
      if (revesta > totalRevesta) {
        totalRevesta = revesta;
      }
    });

    reportList.forEach((element, index) => {
      if (index < 3) {
        let date = element.Data_Apuracao ? element.Data_Apuracao : element.DATA_APURACAO;
        let momentMonth: any = moment(date).format('M');
        let currentMonthValue = momentMonth - 1;

        let currentMonth = this.dataCtrl.monthArray[currentMonthValue];

        var serviceBarChartData: any = (element.VOLUME_SERVICOS * 100 / totalServicos);
        if (serviceBarChartData > 100) {
          serviceBarChartData = 100;
        }
        serviceBarChartData = serviceBarChartData.toFixed(0);

        var revisitBarChartData: any = parseFloat(element.REVISITA);
        revisitBarChartData *= 100;
        revisitBarChartData = revisitBarChartData.toFixed(2);

        var totalChartData: any = (element.Total_De_Pontos * 100 / totalPoints);
        if (totalChartData > 100) {
          totalChartData = 100;
        }
        totalChartData = totalChartData.toFixed(0);

        let firstStructure = {
          month: currentMonth,
          total: serviceBarChartData + '%',
          value: this.ptBrNumberFormat(element.VOLUME_SERVICOS, false),
        };

        let secondStructure = {
          month: currentMonth,
          total: totalRevesta + '%',
          value: revisitBarChartData + '%',
        };

        let totalStructure = {
          month: currentMonth,
          total: totalChartData + '%',
          value: this.ptBrNumberFormat(element.Total_De_Pontos, false),
        };

        firstStructureList.push(firstStructure);
        secondStructureList.push(secondStructure);
        totalStructureList.push(totalStructure);
      }
    });

    finalStructure.push(firstStructureList.reverse());
    finalStructure.push(secondStructureList.reverse());
    finalStructure.push(totalStructureList.reverse());

    let data = {
      title: viewTitle,
      report: finalStructure
    };
    this.publishCustomEvent(broadCastToken, data);
  }

  setTecnicoData(report, broadCastToken) {
    if (!report.length) {
      return false;
    }

    let viewTitle = ['quantidade de serviços', 'revisita (%)', 'caixas conectadas', 'total de pontos', 'quantidade de vendas'];
    let finalStructure = [];
    let reportList = report;
    let totalPoints = 0;
    let totalServicos = 0;
    let totalConexao = 0;
    let totalSales = 0;

    let firstStructureList = [];
    let secondStructureList = [];
    let thirdStructureList = [];
    let totalStructureList = [];
    let salesStructureList = [];

    reportList.forEach(element => {
      let pontos = parseInt(element.Total_De_Pontos);
      if (pontos > totalPoints) {
        totalPoints = pontos;
      }
      let servicos = parseInt(element.VOLUME_SERVICOS);
      if (servicos > totalServicos) {
        totalServicos = servicos;
      }
      let conexao = parseInt(element.CONEXAO_SKY_PLAY);
      if (conexao > totalConexao) {
        totalConexao = conexao;
      }

      let qtdeSales = parseInt(element.Qtde_Vendas);
      if (qtdeSales > totalSales) {
        totalSales = qtdeSales;
      }
    });

    reportList.forEach((element, index) => {
      if (index < 3) {
        let date = element.Data_Apuracao ? element.Data_Apuracao : element.DATA_APURACAO;
        let momentMonth: any = moment(date).format('M');
        let currentMonthValue = momentMonth - 1;

        let currentMonth = this.dataCtrl.monthArray[currentMonthValue];

        let serviceBarChartData: any = (element.VOLUME_SERVICOS * 100 / totalServicos);
        if (serviceBarChartData > 100) {
          serviceBarChartData = 100;
        }
        serviceBarChartData = serviceBarChartData.toFixed(0);

        let revisitBarChartData: any = parseFloat(element.REVISITA)
        revisitBarChartData *= 100;
        revisitBarChartData = revisitBarChartData.toFixed(2);

        let connectionsChartData: any = (element.CONEXAO_SKY_PLAY * 100 / totalConexao);
        if (connectionsChartData > 100) {
          connectionsChartData = 100;
        }
        connectionsChartData = connectionsChartData.toFixed(0);

        let totalChartData: any = (element.Total_De_Pontos * 100 / totalPoints);
        if (totalChartData > 100) {
          totalChartData = 100;
        }
        totalChartData = totalChartData.toFixed(0);

        let qtdeSalesBarChartData: any = element.Qtde_Vendas;
        if (qtdeSalesBarChartData > 100) {
          qtdeSalesBarChartData = 100;
        }

        let firstStructure = {
          month: currentMonth,
          total: serviceBarChartData + '%',
          value: this.ptBrNumberFormat(element.VOLUME_SERVICOS, false),
        };

        let secondStructure = {
          month: currentMonth,
          total: revisitBarChartData + '%',
          value: revisitBarChartData + '%',
        };

        let thirdStructure = {
          month: currentMonth,
          total: connectionsChartData + '%',
          value: this.ptBrNumberFormat(element.CONEXAO_SKY_PLAY, false),
        };

        let totalStructure = {
          month: currentMonth,
          total: totalChartData + '%',
          value: this.ptBrNumberFormat(element.Total_De_Pontos, false),
        };

        let salesStructure = {
          month: currentMonth,
          total: qtdeSalesBarChartData + '%',
          value: this.ptBrNumberFormat(element.Qtde_Vendas, false),
        };

        firstStructureList.push(firstStructure);
        secondStructureList.push(secondStructure);
        thirdStructureList.push(thirdStructure);
        totalStructureList.push(totalStructure);
        salesStructureList.push(salesStructure);
      }
    });
    finalStructure.push(firstStructureList.reverse());
    finalStructure.push(secondStructureList.reverse());
    finalStructure.push(thirdStructureList.reverse());
    finalStructure.push(totalStructureList.reverse());
    finalStructure.push(salesStructureList.reverse());
    let data = {
      title: viewTitle,
      report: finalStructure
    };
    this.publishCustomEvent(broadCastToken, data);
  }

  setTorreData(report, broadCastToken) {
    let viewTitle = ['QUANTIDADE DE SERVIÇOS PDV', 'índice de qualidade (%)', 'total de pontos'];
    let finalStructure = [];
    let reportList = report;
    let totalPoints = 0;
    let totalServicos = 0;

    let firstStructureList = [];
    let secondStructureList = [];
    let totalStructureList = [];

    reportList.forEach(element => {
      let pontos = parseInt(element.Total_De_Pontos);
      if (pontos > totalPoints) {
        totalPoints = pontos;
      }
      let servicos = parseInt(element.VOLUME_SERVICOS);
      if (servicos > totalServicos) {
        totalServicos = servicos;
      }
    });

    reportList.forEach((element, index) => {
      if (index < 3) {
        let date = element.Data_Apuracao ? element.Data_Apuracao : element.DATA_APURACAO;
        let momentMonth: any = moment(date).format('M');
        let currentMonthValue = momentMonth - 1;

        let currentMonth = this.dataCtrl.monthArray[currentMonthValue];

        var serviceBarChartData: any = (element.VOLUME_SERVICOS * 100 / totalServicos);
        if (serviceBarChartData > 100) {
          serviceBarChartData = 100;
        }
        serviceBarChartData = serviceBarChartData.toFixed(0);

        var revisitBarChartData: any = parseFloat(element.IQ);
        revisitBarChartData *= 100;
        revisitBarChartData = revisitBarChartData.toFixed(2);

        var totalChartData: any = (element.Total_De_Pontos * 100 / totalPoints);
        if (totalChartData > 100) {
          totalChartData = 100;
        }
        totalChartData = totalChartData.toFixed(0);
        let firstStructure = {
          month: currentMonth,
          total: serviceBarChartData + '%',
          value: this.ptBrNumberFormat(element.VOLUME_SERVICOS, false),
        };

        let secondStructure = {
          month: currentMonth,
          total: revisitBarChartData + '%',
          value: revisitBarChartData + '%',
        };

        let totalStructure = {
          month: currentMonth,
          total: totalChartData + '%',
          value: this.ptBrNumberFormat(element.Total_De_Pontos, false),
        };

        firstStructureList.push(firstStructure);
        secondStructureList.push(secondStructure);
        totalStructureList.push(totalStructure);
      }
    });

    finalStructure.push(firstStructureList.reverse());
    finalStructure.push(secondStructureList.reverse());
    finalStructure.push(totalStructureList.reverse());

    let data = {
      title: viewTitle,
      report: finalStructure
    };
    this.publishCustomEvent(broadCastToken, data);
  }

  setTelevendasData(report, broadCastToken) {
    if (!report.length) {
      return false;
    }

    let viewTitle = ['QUANTIDADE DE VENDAS', '% 1ª FATURA PAGA', '2ª RECARGA (%)', 'TOTAL DE PONTOS'];
    let finalStructure = [];
    let reportList = report;
    let totalPoints = 0;
    let totalServicos = 0;
    let totalConexao = 0;

    let firstStructureList = [];
    let secondStructureList = [];
    let thirdStructureList = [];
    let totalStructureList = [];

    reportList.forEach(element => {
      let pontos = parseInt(element.Total_De_Pontos);
      if (pontos > totalPoints) {
        totalPoints = pontos;
      }
      let servicos = parseInt(element.Vendas_Totais);
      if (servicos > totalServicos) {
        totalServicos = servicos;
      }
      let conexao = parseInt(element.Recarga);
      if (conexao > totalConexao) {
        totalConexao = conexao;
      }
    });


    reportList.forEach((element, index) => {
      if (index < 3) {
        let date = element.Data_Apuracao ? element.Data_Apuracao : element.DATA_APURACAO;
        let momentMonth: any = moment(date).format('M');
        let currentMonthValue = momentMonth - 1;

        let currentMonth = this.dataCtrl.monthArray[currentMonthValue];

        var serviceBarChartData = element.Vendas_Totais ? parseFloat(element.Vendas_Totais) * 100 / totalServicos : 0;
        serviceBarChartData = serviceBarChartData;

        var revisitBarChartData: any = parseFloat(element.P2) ? parseFloat(element.P2) : 0;
        revisitBarChartData *= 100;
        revisitBarChartData = revisitBarChartData.toFixed(2);

        var connectionsChartData: any = element.CONEXAO_SKY_PLAY ? (element.CONEXAO_SKY_PLAY * 100 / totalConexao) : 0;
        if (connectionsChartData > 100) {
          connectionsChartData = 100;
        }
        connectionsChartData = connectionsChartData.toFixed(0);

        var totalChartData: any = element.Total_De_Pontos ? (element.Total_De_Pontos * 100 / totalPoints) : 0;
        if (totalChartData > 100) {
          totalChartData = 100;
        }
        totalChartData = totalChartData.toFixed(0);

        let firstStructure = {
          month: currentMonth,
          total: serviceBarChartData.toFixed(2) + '%',
          value: this.ptBrNumberFormat(element.Vendas_Totais, false),
        };

        let secondStructure = {
          month: currentMonth,
          total: revisitBarChartData + '%',
          value: parseFloat(revisitBarChartData).toFixed(2) + '%',
        };

        let recharge = element.Recarga ? parseFloat(element.Recarga) * 100 : 0;
        let thirdStructure = {
          month: currentMonth,
          total: parseFloat(recharge.toString()).toFixed(2) + '%',
          value: parseFloat(recharge.toString()).toFixed(2) + '%',
        };

        let totalStructure = {
          month: currentMonth,
          total: totalChartData + '%',
          value: this.ptBrNumberFormat(element.Total_De_Pontos, false),
        };

        firstStructureList.push(firstStructure);
        secondStructureList.push(secondStructure);
        thirdStructureList.push(thirdStructure);
        totalStructureList.push(totalStructure);
      }
    });

    finalStructure.push(firstStructureList.reverse());
    finalStructure.push(secondStructureList.reverse());
    finalStructure.push(thirdStructureList.reverse());
    finalStructure.push(totalStructureList.reverse());
    let data = {
      title: viewTitle,
      report: finalStructure
    };
    this.publishCustomEvent(broadCastToken, data);
  }

  setVendadorInternoData(report, broadCastToken) {
    if (!report.length) {
      return false;
    }

    let viewTitle = ['QUANTIDADE DE VENDAS', '% 1ª FATURA PAGA', '2ª RECARGA (%)', 'TOTAL DE PONTOS'];
    let finalStructure = [];
    let reportList = report;
    let totalPoints = 0;
    let totalServicos = 0;
    let totalConexao = 0;

    let firstStructureList = [];
    let secondStructureList = [];
    let thirdStructureList = [];
    let totalStructureList = [];

    reportList.forEach(element => {
      let pontos = parseInt(element.Total_De_Pontos);
      if (pontos > totalPoints) {
        totalPoints = pontos;
      }
      let servicos = parseInt(element.Vendas_Totais);
      if (servicos > totalServicos) {
        totalServicos = servicos;
      }
      let conexao = parseInt(element.Recarga);
      if (conexao > totalConexao) {
        totalConexao = conexao;
      }
    });


    reportList.forEach((element, index) => {
      if (index < 3) {
        let date = element.Data_Apuracao ? element.Data_Apuracao : element.DATA_APURACAO;
        let momentMonth: any = moment(date).format('M');
        let currentMonthValue = momentMonth - 1;

        let currentMonth = this.dataCtrl.monthArray[currentMonthValue];

        var serviceBarChartData = element.Vendas_Totais ? parseFloat(element.Vendas_Totais) * 100 / totalServicos : 0;
        serviceBarChartData = serviceBarChartData;

        var revisitBarChartData: any = parseFloat(element.P2) ? parseFloat(element.P2) : 0;
        revisitBarChartData *= 100;
        revisitBarChartData = revisitBarChartData.toFixed(2);

        var connectionsChartData: any = element.CONEXAO_SKY_PLAY ? (element.CONEXAO_SKY_PLAY * 100 / totalConexao) : 0;
        if (connectionsChartData > 100) {
          connectionsChartData = 100;
        }
        connectionsChartData = connectionsChartData.toFixed(0);

        var totalChartData: any = element.Total_De_Pontos ? (element.Total_De_Pontos * 100 / totalPoints) : 0;
        if (totalChartData > 100) {
          totalChartData = 100;
        }
        totalChartData = totalChartData.toFixed(0);

        let firstStructure = {
          month: currentMonth,
          total: serviceBarChartData.toFixed(2) + '%',
          value: this.ptBrNumberFormat(element.Vendas_Totais, false),
        };

        let secondStructure = {
          month: currentMonth,
          total: revisitBarChartData + '%',
          value: parseFloat(revisitBarChartData).toFixed(2) + '%',
        };

        let recharge = element.Recarga ? parseFloat(element.Recarga) * 100 : 0;
        let thirdStructure = {
          month: currentMonth,
          total: parseFloat(recharge.toString()).toFixed(2) + '%',
          value: parseFloat(recharge.toString()).toFixed(2) + '%',
        };

        let totalStructure = {
          month: currentMonth,
          total: totalChartData + '%',
          value: this.ptBrNumberFormat(element.Total_De_Pontos, false),
        };

        firstStructureList.push(firstStructure);
        secondStructureList.push(secondStructure);
        thirdStructureList.push(thirdStructure);
        totalStructureList.push(totalStructure);
      }
    });

    finalStructure.push(firstStructureList.reverse());
    finalStructure.push(secondStructureList.reverse());
    finalStructure.push(thirdStructureList.reverse());
    finalStructure.push(totalStructureList.reverse());
    let data = {
      title: viewTitle,
      report: finalStructure
    };
    this.publishCustomEvent(broadCastToken, data);
  }

  setVendedorData(report, broadCastToken) {
    if (!report.length) {
      return false;
    }

    let viewTitle = ['QUANTIDADE DE VENDAS', '% 1ª FATURA PAGA', '2ª RECARGA (%)', 'TOTAL DE PONTOS'];
    let finalStructure = [];
    let reportList = report;
    let totalPoints = 0;
    let totalServicos = 0;
    let totalConexao = 0;

    let firstStructureList = [];
    let secondStructureList = [];
    let thirdStructureList = [];
    let totalStructureList = [];

    reportList.forEach(element => {
      let pontos = parseInt(element.Total_De_Pontos);
      if (pontos > totalPoints) {
        totalPoints = pontos;
      }
      let servicos = parseInt(element.Vendas_Totais);
      if (servicos > totalServicos) {
        totalServicos = servicos;
      }
      let data = element.Recarga * 100;
      let conexao = parseInt(data.toString());
      if (conexao > totalConexao) {
        totalConexao = conexao;
      }
    });

    reportList.forEach((element, index) => {
      if (index < 3) {
        let date = element.Data_Apuracao ? element.Data_Apuracao : element.DATA_APURACAO;
        let momentMonth: any = moment(date).format('M');
        let currentMonthValue = momentMonth - 1;

        let currentMonth = this.dataCtrl.monthArray[currentMonthValue];

        var serviceBarChartData = (element.Vendas_Totais * 100 / totalServicos);
        if (serviceBarChartData > 100) {
          serviceBarChartData = 100;
        }
        serviceBarChartData.toFixed(0);
        var revisitBarChartData: any = element.P2 ? parseFloat(element.P2) : 0;
        revisitBarChartData *= 100;
        revisitBarChartData = revisitBarChartData.toFixed(2);

        let data = element.Recarga * 100;
        var connectionsChartData: any = parseFloat(data.toString());
        if (connectionsChartData > 100) {
          connectionsChartData = 100;
        }
        connectionsChartData = parseFloat(connectionsChartData.toString()).toFixed(0);

        var totalChartData: any = (element.Total_De_Pontos * 100 / totalPoints);
        if (totalChartData > 100) {
          totalChartData = 100;
        }
        totalChartData = totalChartData.toFixed(0);

        let firstStructure = {
          month: currentMonth,
          total: serviceBarChartData + '%',
          value: this.ptBrNumberFormat(element.Vendas_Totais, false),
        };

        let secondStructure = {
          month: currentMonth,
          total: revisitBarChartData + '%',
          value: parseFloat(revisitBarChartData).toFixed(2) + '%',
        };

        let recharge = parseFloat(element.Recarga) * 100;
        let thirdStructure = {
          month: currentMonth,
          total: parseFloat(recharge.toString()).toFixed(2) + '%',
          value: parseFloat(recharge.toString()).toFixed(2) + '%',
        };

        let totalStructure = {
          month: currentMonth,
          total: totalChartData + '%',
          value: this.ptBrNumberFormat(element.Total_De_Pontos, false),
        };

        firstStructureList.push(firstStructure);
        secondStructureList.push(secondStructure);
        thirdStructureList.push(thirdStructure);
        totalStructureList.push(totalStructure);
      }
    });

    finalStructure.push(firstStructureList.reverse());
    finalStructure.push(secondStructureList.reverse());
    finalStructure.push(thirdStructureList.reverse());
    finalStructure.push(totalStructureList.reverse());
    let data = {
      title: viewTitle,
      report: finalStructure
    };
    this.publishCustomEvent(broadCastToken, data);
  }

  setAlmoxarifeDistribuidorData(report, broadCastToken) {
    if (!report.length) {
      return false;
    }

    let viewTitle = ['sla de abastecimento', 'total de pontos'];
    let finalStructure = [];
    let reportList = report;
    let totalPoints = 0;
    let totalServicos = 0;
    let totalChartData = 0;

    let firstStructureList = [];
    let secondStructureList = [];
    let thirdStructureList = [];
    let totalStructureList = [];

    reportList.forEach(element => {
      let points = parseFloat(element.total_de_pontos);

      if (points > totalPoints) {
        totalPoints = points;
      }
      let servicos = parseInt(element.Volume_Servicos_PDV);
      if (servicos > totalServicos) {
        totalServicos = servicos;
      }
    });

    reportList.forEach((element, index) => {
      console.log(element, index);
      if (index < 3) {
        let date = element.Data_Apuracao ? element.Data_Apuracao : element.DATA_APURACAO;
        let momentMonth: any = moment(date).format('M');
        let currentMonthValue = momentMonth - 1;

        let currentMonth = this.dataCtrl.monthArray[currentMonthValue];
        var serviceBarChartData = (element.sla_abastecimento);
        serviceBarChartData *= 100;
        if (serviceBarChartData > 100) {
          serviceBarChartData = 100;
        }
        serviceBarChartData.toFixed(0);

        var revisitBarChartData = parseFloat(element.sla_abastecimento);
        revisitBarChartData *= 100;
        revisitBarChartData.toFixed(2);

        var connectionsChartData = element.Consumo_De_Material * 100;
        connectionsChartData.toFixed(0);

        var totalChartData: any = (element.total_de_pontos * 100 / totalPoints);
        if (totalChartData > 100) {
          totalChartData = 100;
        }
        totalChartData = totalChartData.toFixed(0);


        if (totalChartData > 100) {
          totalChartData = 100;
        }

        let firstStructure = {
          month: currentMonth,
          total: serviceBarChartData.toFixed(2) + '%',
          value: serviceBarChartData + '%',
        };

        let secondStructure = {
          month: currentMonth,
          total: revisitBarChartData + '%',
          value: revisitBarChartData + '%',
        };

        let thirdStructure = {
          month: currentMonth,
          total: connectionsChartData.toFixed(0) + '%',
          value: connectionsChartData.toFixed(0) + '%',
        };

        let totalStructure = {
          month: currentMonth,
          total: totalChartData + '%',
          value: element.total_de_pontos ? this.ptBrNumberFormat(element.total_de_pontos, true) : 0,
        };


        firstStructureList.push(firstStructure);
        secondStructureList.push(secondStructure);
        thirdStructureList.push(thirdStructure);
        totalStructureList.push(totalStructure);
      }
    });
    finalStructure.push(firstStructureList.reverse());
    //finalStructure.push(secondStructureList.reverse());
    //finalStructure.push(thirdStructureList.reverse());
    finalStructure.push(totalStructureList.reverse());
    let data = {
      title: viewTitle,
      report: finalStructure
    };
    this.publishCustomEvent(broadCastToken, data);
  }

  setTorreDistribuidorData(report, broadCastToken) {
    let viewTitle = ['tempo de atendimento do pj', 'total de pontos'];
    let finalStructure = [];
    let reportList = report;
    let totalPoints = 0;
    let totalServicos = 0;

    let firstStructureList = [];
    let secondStructureList = [];
    let totalStructureList = [];

    reportList.forEach(element => {
      let pontos = parseInt(element.Total_De_Pontos);
      if (pontos > totalPoints) {
        totalPoints = pontos;
      }
      let servicos = parseInt(element.VOLUME_SERVICOS);
      if (servicos > totalServicos) {
        totalServicos = servicos;
      }
    });

    reportList.forEach((element, index) => {
      if (index < 3) {
        let date = element.Data_Apuracao ? element.Data_Apuracao : element.DATA_APURACAO;
        let momentMonth: any = moment(date).format('M');
        let currentMonthValue = momentMonth - 1;

        let currentMonth = this.dataCtrl.monthArray[currentMonthValue];

        var serviceBarChartData: any = (element.VOLUME_SERVICOS * 100 / totalServicos);
        if (serviceBarChartData > 100) {
          serviceBarChartData = 100;
        }
        serviceBarChartData = serviceBarChartData.toFixed(0);

        var revisitBarChartData: any = parseFloat(element.IQ);
        revisitBarChartData = element.tma_horas ? parseFloat(element.tma_horas) : 0;

        revisitBarChartData = revisitBarChartData.toFixed(0);
        console.log(revisitBarChartData);

        var totalChartData: any = (element.Total_De_Pontos * 100 / totalPoints);
        if (totalChartData > 100) {
          totalChartData = 100;
        }
        totalChartData = totalChartData.toFixed(0);
        let firstStructure = {
          month: currentMonth,
          total: serviceBarChartData + '%',
          value: this.ptBrNumberFormat(element.VOLUME_SERVICOS, false),
        };

        let secondStructure = {
          month: currentMonth,
          total: revisitBarChartData + '%',
          value: revisitBarChartData + 'h',
        };

        let totalStructure = {
          month: currentMonth,
          total: totalChartData + '%',
          value: element.Total_De_Pontos ? this.ptBrNumberFormat(element.Total_De_Pontos, false) : 0,
        };

        firstStructureList.push(firstStructure);
        secondStructureList.push(secondStructure);
        totalStructureList.push(totalStructure);
      }
    });

    //finalStructure.push(firstStructureList.reverse());
    finalStructure.push(secondStructureList.reverse());
    finalStructure.push(totalStructureList.reverse());

    let data = {
      title: viewTitle,
      report: finalStructure
    };
    this.publishCustomEvent(broadCastToken, data);
  }

  setSupervisorDeVendasDistribuidorData(report, broadCastToken) {
    if (!report.length) {
      return false;
    }

    let viewTitle = ['VENDAS HABILITADAS DA REDE CREDENCIADA SKY + PJ DISTRIBUIDOR', 'total de pontos'];
    let finalStructure = [];
    let reportList = report;
    let totalPoints = 0;
    let totalServicos = 0;
    let totalChartData = 0;

    let firstStructureList = [];
    let secondStructureList = [];
    let thirdStructureList = [];
    let totalStructureList = [];

    reportList.forEach(element => {
      let points = parseFloat(element.Total_De_Pontos);

      if (points > totalPoints) {
        totalPoints = points;
      }
      let servicos = parseInt(element.Volume_Servicos_PDV);
      if (servicos > totalServicos) {
        totalServicos = servicos;
      }
    });

    reportList.forEach((element, index) => {
      console.log(element, index);
      if (index < 3) {
        let date = element.Data_Apuracao ? element.Data_Apuracao : element.DATA_APURACAO;
        let momentMonth: any = moment(date).format('M');
        let currentMonthValue = momentMonth - 1;

        let currentMonth = this.dataCtrl.monthArray[currentMonthValue];
        var serviceBarChartData = (element.percent_meta);
        serviceBarChartData *= 100;
        if (serviceBarChartData > 100) {
          serviceBarChartData = 100;
        }
        serviceBarChartData.toFixed(0);

        var revisitBarChartData = parseFloat(element.percent_meta);
        revisitBarChartData *= 100;
        revisitBarChartData.toFixed(2);

        var connectionsChartData = element.percent_meta * 100;
        if (connectionsChartData > 100) {
          connectionsChartData = 100;
        }
        connectionsChartData.toFixed(0);

        var totalChartData: any = (element.Total_De_Pontos * 100 / totalPoints);
        if (totalChartData > 100) {
          totalChartData = 100;
        }
        totalChartData = totalChartData.toFixed(0);


        if (totalChartData > 100) {
          totalChartData = 100;
        }

        let firstStructure = {
          month: currentMonth,
          total: serviceBarChartData.toFixed(2) + '%',
          value: serviceBarChartData + '%',
        };

        let secondStructure = {
          month: currentMonth,
          total: revisitBarChartData + '%',
          value: revisitBarChartData + '%',
        };

        let thirdStructure = {
          month: currentMonth,
          total: connectionsChartData.toFixed(0) + '%',
          value: connectionsChartData.toFixed(0) + '%',
        };

        let totalStructure = {
          month: currentMonth,
          total: totalChartData + '%',
          value: element.Total_De_Pontos ? this.ptBrNumberFormat(element.Total_De_Pontos, true) : 0,
        };


        //firstStructureList.push(firstStructure);
        //secondStructureList.push(secondStructure);
        thirdStructureList.push(thirdStructure);
        totalStructureList.push(totalStructure);
      }
    });
    //finalStructure.push(firstStructureList.reverse());
    //finalStructure.push(secondStructureList.reverse());
    finalStructure.push(thirdStructureList.reverse());
    finalStructure.push(totalStructureList.reverse());
    let data = {
      title: viewTitle,
      report: finalStructure
    };
    this.publishCustomEvent(broadCastToken, data);
  }

  setGerenteDistribuidorData(report, broadCastToken) {
    if (!report.length) {
      return false;
    }

    let viewTitle = ['total de pontos', 'tempo de atendimento do pj', 'sla de abast.', 'VENDAS HABILITADAS DA REDE CREDENCIADA SKY + PJ DISTRIBUIDOR'];
    let finalStructure = [];
    let reportList = report;
    let totalPoints = 0;
    let totalServicos = 0;
    let totalChartData = 0;

    let firstStructureList = [];
    let secondStructureList = [];
    let thirdStructureList = [];
    let totalStructureList = [];

    reportList.forEach(element => {
      let points = parseFloat(element.Total_De_Pontos);

      if (points > totalPoints) {
        totalPoints = points;
      }
      let servicos = parseInt(element.Volume_Servicos_PDV);
      if (servicos > totalServicos) {
        totalServicos = servicos;
      }
    });

    reportList.forEach((element, index) => {
      console.log(element, index);
      if (index < 3) {
        let date = element.Data_Apuracao ? element.Data_Apuracao : element.DATA_APURACAO;
        let momentMonth: any = moment(date).format('M');
        let currentMonthValue = momentMonth - 1;

        let currentMonth = this.dataCtrl.monthArray[currentMonthValue];
        var serviceBarChartData = parseFloat(element.percent_meta);
        serviceBarChartData *= 100;
        var percentBarCharData = Math.round(serviceBarChartData);
        console.log();
        if (percentBarCharData > 100) {
          percentBarCharData = 100;
        }

        var tmaHorasChartData = (element.tma_horas);

        if (tmaHorasChartData > 100) {
          tmaHorasChartData = 100;
        }

        var slaChartData = element.sla_abastecimento * 100;

        if (slaChartData > 100) {
          slaChartData = 100;
        }
        slaChartData.toFixed(0);

        var totalChartData: any = (element.Total_De_Pontos * 100 / totalPoints);
        if (totalChartData > 100) {
          totalChartData = 100;
        }
        totalChartData = totalChartData.toFixed(0);


        if (totalChartData > 100) {
          totalChartData = 100;
        }

        let firstStructure = {
          month: currentMonth,
          total: percentBarCharData + '%',
          value: percentBarCharData + '%',
        };

        let secondStructure = {
          month: currentMonth,
          total: tmaHorasChartData + '%',
          value: tmaHorasChartData + 'H',
        };

        let thirdStructure = {
          month: currentMonth,
          total: slaChartData.toFixed(0) + '%',
          value: slaChartData.toFixed(0) + '%',
        };

        let totalStructure = {
          month: currentMonth,
          total: totalChartData + '%',
          value: element.Total_De_Pontos ? this.ptBrNumberFormat(element.Total_De_Pontos, true) : 0,
        };


        firstStructureList.push(firstStructure);
        secondStructureList.push(secondStructure);
        thirdStructureList.push(thirdStructure);
        totalStructureList.push(totalStructure);
      }
    });
    //finalStructure.push(firstStructureList.reverse());
    finalStructure.push(totalStructureList.reverse());
    finalStructure.push(secondStructureList.reverse());
    finalStructure.push(thirdStructureList.reverse());
    finalStructure.push(firstStructureList.reverse());
    let data = {
      title: viewTitle,
      report: finalStructure
    };
    this.publishCustomEvent(broadCastToken, data);
  }

  setMultiplicadorElsysData(report, broadCastToken) {
    if (!report.length) {
      return false;
    }

    let viewTitle = ['total de pontos', 'VENDAS HABILITADAS <br>(PRÉ-PAGO)', 'COMPRA <br>DE EQUIP.'];
    let finalStructure = [];
    let reportList = report;
    let totalPoints = 0;
    let totalServicos = 0;
    let totalChartData = 0;

    let firstStructureList = [];
    let secondStructureList = [];
    let thirdStructureList = [];
    let totalStructureList = [];

    reportList.forEach(element => {
      let points = parseFloat(element.Total_De_Pontos);

      if (points > totalPoints) {
        totalPoints = points;
      }
      let servicos = parseInt(element.Volume_Servicos_PDV);
      if (servicos > totalServicos) {
        totalServicos = servicos;
      }
    });

    reportList.forEach((element, index) => {
      console.log(element, index);
      if (index < 3) {
        let date = element.Data_Apuracao ? element.Data_Apuracao : element.DATA_APURACAO;
        let momentMonth: any = moment(date).format('M');
        let currentMonthValue = momentMonth - 1;

        let currentMonth = this.dataCtrl.monthArray[currentMonthValue];
        var serviceBarChartData = (element.percent_meta);
        serviceBarChartData *= 100;
        if (serviceBarChartData > 100) {
          serviceBarChartData = 100;
        }
        serviceBarChartData.toFixed(0);

        var compra_EquipBarChartData = parseFloat(element.Ating_Compra_Equip_percent);
        compra_EquipBarChartData *= 100;
        compra_EquipBarChartData.toFixed(2);

        var vendasHabChartData = element.Ating_Vendas_Hab_percent * 100;
        if (vendasHabChartData > 100) {
          vendasHabChartData = 100;
        }
        vendasHabChartData.toFixed(0);

        var totalChartData: any = (element.Total_De_Pontos * 100 / totalPoints);
        if (totalChartData > 100) {
          totalChartData = 100;
        }
        totalChartData = totalChartData.toFixed(0);


        if (totalChartData > 100) {
          totalChartData = 100;
        }

        let firstStructure = {
          month: currentMonth,
          total: serviceBarChartData.toFixed(2) + '%',
          value: serviceBarChartData + '%',
        };

        let secondStructure = {
          month: currentMonth,
          total: compra_EquipBarChartData + '%',
          value: compra_EquipBarChartData + '%',
        };

        let thirdStructure = {
          month: currentMonth,
          total: vendasHabChartData.toFixed(0) + '%',
          value: vendasHabChartData.toFixed(0) + '%',
        };

        let totalStructure = {
          month: currentMonth,
          total: totalChartData + '%',
          value: element.Total_De_Pontos ? this.ptBrNumberFormat(element.Total_De_Pontos, false) : 0,
        };


        //firstStructureList.push(firstStructure);
        secondStructureList.push(secondStructure);
        thirdStructureList.push(thirdStructure);
        totalStructureList.push(totalStructure);
      }
    });
    //finalStructure.push(firstStructureList.reverse());
    finalStructure.push(totalStructureList.reverse());
    finalStructure.push(thirdStructureList.reverse());
    finalStructure.push(secondStructureList.reverse());
    let data = {
      title: viewTitle,
      report: finalStructure
    };
    this.publishCustomEvent(broadCastToken, data);
  }

  setProprietarioElsysData(report, broadCastToken) {
    if (!report.length) {
      return false;
    }

    let viewTitle = ['total de pontos', 'VENDAS HABILITADAS <br>(PRÉ-PAGO)', 'COMPRA <br>DE EQUIP.'];
    let finalStructure = [];
    let reportList = report;
    let totalPoints = 0;
    let totalServicos = 0;
    let totalChartData = 0;

    let firstStructureList = [];
    let secondStructureList = [];
    let thirdStructureList = [];
    let totalStructureList = [];

    reportList.forEach(element => {
      let points = parseFloat(element.Total_De_Pontos);

      if (points > totalPoints) {
        totalPoints = points;
      }
      let servicos = parseInt(element.Volume_Servicos_PDV);
      if (servicos > totalServicos) {
        totalServicos = servicos;
      }
    });

    reportList.forEach((element, index) => {
      console.log(element, index);
      if (index < 3) {
        let date = element.Data_Apuracao ? element.Data_Apuracao : element.DATA_APURACAO;
        let momentMonth: any = moment(date).format('M');
        let currentMonthValue = momentMonth - 1;

        let currentMonth = this.dataCtrl.monthArray[currentMonthValue];
        var serviceBarChartData = (element.percent_meta);
        serviceBarChartData *= 100;
        if (serviceBarChartData > 100) {
          serviceBarChartData = 100;
        }
        serviceBarChartData.toFixed(0);

        var compra_EquipBarChartData = parseFloat(element.Ating_Compra_Equip_perc);
        compra_EquipBarChartData *= 100;
        compra_EquipBarChartData.toFixed(2);

        var vendasHabChartData = element.Ating_Vendas_Hab_perc * 100;
        if (vendasHabChartData > 100) {
          vendasHabChartData = 100;
        }
        vendasHabChartData.toFixed(0);

        var totalChartData: any = (element.Total_De_Pontos * 100 / totalPoints);
        if (totalChartData > 100) {
          totalChartData = 100;
        }
        totalChartData = totalChartData.toFixed(0);


        if (totalChartData > 100) {
          totalChartData = 100;
        }

        let firstStructure = {
          month: currentMonth,
          total: serviceBarChartData.toFixed(2) + '%',
          value: serviceBarChartData + '%',
        };

        let secondStructure = {
          month: currentMonth,
          total: compra_EquipBarChartData + '%',
          value: compra_EquipBarChartData + '%',
        };

        let thirdStructure = {
          month: currentMonth,
          total: vendasHabChartData.toFixed(0) + '%',
          value: vendasHabChartData.toFixed(0) + '%',
        };

        let totalStructure = {
          month: currentMonth,
          total: totalChartData + '%',
          value: element.Total_De_Pontos ? this.ptBrNumberFormat(element.Total_De_Pontos, false) : 0,
        };


        //firstStructureList.push(firstStructure);
        secondStructureList.push(secondStructure);
        thirdStructureList.push(thirdStructure);
        totalStructureList.push(totalStructure);
      }
    });
    //finalStructure.push(firstStructureList.reverse());
    finalStructure.push(totalStructureList.reverse());
    finalStructure.push(thirdStructureList.reverse());
    finalStructure.push(secondStructureList.reverse());
    let data = {
      title: viewTitle,
      report: finalStructure
    };
    this.publishCustomEvent(broadCastToken, data);
  }

  mapUserWeeklyDetail(userDashboardData, broadCastToken) {
    if (!Object.keys(userDashboardData).length) {
      return false;
    }

    userDashboardData.forEach(element => {
      if (element.role == 'almoxarife') {
        this.setAlmoxarifeMonthlyData(element.report, broadCastToken);
      } else if (element.role == 'supervisor_de_televendas') {
        this.setSuperfisorTelevendasMonthlyData(element.report, broadCastToken);
      } else if (element.role == 'supervisor_de_vendas') {
        this.setSupervisorDeVendasMonthlyData(element.report, broadCastToken);
      } else if (element.role == 'supervisor_tcnico') {
        this.setSupervisorTecnicoMonthlyData(element.report, broadCastToken);
      } else if (element.role == 'tecnico') {
        this.setTecnicoMonthlyData(element.report, broadCastToken);
      } else if (element.role == 'torre') {
        this.setTorreMonthlyData(element.report, broadCastToken);
      } else if (element.role == 'televendas') {
        this.setTelevendasMonthlyData(element.report, broadCastToken);
      } else if (element.role == 'vendedor') {
        this.setVendedorMonthlyData(element.report, broadCastToken);
      } else if (element.role == 'proprietrio') {
        this.setProprietrioData(element.report, broadCastToken);
      } else if (element.role == 'vendedor_interno') {
        this.setVendadorInternoMonthlyData(element.report, broadCastToken);
      } else if (element.role == 'almoxarife_distribuidor') {
        this.setAlmoxarifeDistribuidorMonthlyData(element.report, broadCastToken);
      } else if (element.role == 'torre_distribuidor') {
        this.setTorreDistribuidorMonthlyData(element.report, broadCastToken);
      } else if (element.role == 'supervisor_vendas_distribuidor') {
        this.setSupervisorDeVendasDistribuidorMonthlyData(element.report, broadCastToken);
      } else if (element.role == 'gerente_distribuidor') {
        this.setGerenteDistribuidorMonthlyData(element.report, broadCastToken);
      } else if (element.role == 'multiplicador_elsys') {
        this.setMultiplicadorElsysMonthlyData(element.report, broadCastToken);
      } else if (element.role == 'proprietario_elsys') {
        this.setProprietarioElsysMonthlyData(element.report, broadCastToken);
      } else {

      }
    });
  }

  setProprietrioData(report, broadCastToken) {
    if (!report[0]) {
      return {};
    }
    let userData = report[0];
    let Ating_Meta_TV: any = parseFloat(userData.Ating_Meta_TV);
    let P2: any = parseFloat(userData.P2);
    let Recarga: any = parseFloat(userData.Recarga);
    let perc_Reab_Inst: any = parseFloat(userData.perc_Reab_Inst);
    let TMAh: any = parseFloat(userData.TMAh);
    let perc_Reab_AT: any = parseFloat(userData.perc_Reab_AT);
    let perc_Cump_Ag: any = parseFloat(userData.perc_Cump_Ag);
    let perc_Meta_Bl: any = parseFloat(userData.perc_Meta_Bl);
    let perc_Ating_Conv: any = parseFloat(userData.perc_Ating_Conv);
    let perc_Abandono: any = parseFloat(userData.perc_Abandono);
    let perc_Sucesso_RetiradaProj: any = parseFloat(userData.perc_Sucesso_RetiradaProj || 0) || 0.0;
    let perc_Sucesso_RetiradaReal: any = userData.perc_Sucesso_RetiradaReal;

    TMAh = TMAh.toFixed(2);
    P2 = P2 * 100;
    Recarga = Recarga * 100;
    perc_Reab_Inst = perc_Reab_Inst * 100;
    perc_Reab_AT = perc_Reab_AT * 100;
    perc_Cump_Ag = perc_Cump_Ag * 100;
    perc_Sucesso_RetiradaProj = perc_Sucesso_RetiradaProj * 100;
    Ating_Meta_TV = Ating_Meta_TV * 100;
    //perc_Meta_Bl = perc_Meta_Bl * 100;
    perc_Ating_Conv = perc_Ating_Conv * 100;
    perc_Abandono = perc_Abandono * 100;
    perc_Sucesso_RetiradaReal = perc_Sucesso_RetiradaReal * 100;

    let data = {
      starValue: userData.ESTRELAS,
      retiradaProject: perc_Sucesso_RetiradaReal.toFixed(2) + '%',
      Ating_Meta_TV: Ating_Meta_TV ? Ating_Meta_TV.toFixed(2) + '%' : '0,00%',
      P2: P2 ? P2.toFixed(2) + '%' : '0,00%',
      Recarga: Recarga ? Recarga.toFixed(2) + '%' : '0,00%',
      perc_Reab_Inst: perc_Reab_Inst ? perc_Reab_Inst.toFixed(2) + '%' : '0,00%',
      TMAh: TMAh,
      perc_Reab_AT: perc_Reab_AT ? perc_Reab_AT.toFixed(2) + '%' : '0,00%',
      perc_Cump_Ag: perc_Cump_Ag ? perc_Cump_Ag.toFixed(2) + '%' : '0,00%',
      perc_Meta_Bl: perc_Meta_Bl ? perc_Meta_Bl.toFixed(2) : '0,00%',
      perc_Ating_Conv: perc_Ating_Conv ? perc_Ating_Conv.toFixed(2) + '%' : '0,00%',
      perc_Abandono: perc_Abandono ? perc_Abandono.toFixed(2) + '%' : '0,00%',
      perc_Sucesso_RetiradaProj: perc_Sucesso_RetiradaProj ? perc_Sucesso_RetiradaProj.toFixed(2) + '%' : '0,00%',
      date: userData.Data_Apuracao
    }

    let notaList = {
      notaMeta_TV: userData.nota_Ating_Meta_TV,
      notaP2: userData.nota_P2,
      notaRecarga: userData.nota_Recarga,

      notaTMAh: userData.nota_TMAh,
      notaReab_AT: userData.nota_perc_Reab_AT,
      notaCump_Ag: userData.nota_perc_Cump_Ag,
      notaRetiradaReal: userData.nota_perc_Sucesso_RetiradaReal,
      notaReab_Inst: userData.nota_perc_Reab_Inst,
      notaMetaBl: userData.nota_perc_Meta_Bl,
      notAtConversao: userData.nota_perc_ating_conv,
      notaPercAbandono: userData.nota_perc_Abandono,
    };
    let notaValue: any = {};
    for (var prop in notaList) {
      if (notaList[prop] && notaList[prop].includes('1')) {
        notaValue[prop + '1'] = true;
      } else if (notaList[prop] && notaList[prop].includes('2')) {
        notaValue[prop + '2'] = true;
      } else if (notaList[prop] && notaList[prop].includes('3')) {
        notaValue[prop + '3'] = true;
      } else if (notaList[prop] && notaList[prop].includes('4')) {
        notaValue[prop + '4'] = true;
      } else if (notaList[prop] && notaList[prop].includes('5')) {
        notaValue[prop + '5'] = true;
      } else {
      }
    }
    Object.assign(data, notaValue);
    let total = 0;
    [1, 2, 3, 4, 5].forEach(v => {
      if (userData['N' + v]) {
        data['N' + v] = userData['N' + v];
        total += parseInt(userData['N' + v]);
      }
    });
    data['NSum'] = total;
    if (userData['ESTRELAS']) {
      data['ESTRELAS'] = userData['ESTRELAS'];
    }
    console.log(data);
    this.publishCustomEvent(broadCastToken, data);
  }

  setAlmoxarifeMonthlyData(report, broadCastToken) {
    let data = report[0];
    if (!data) {
      return false;
    }
    let date = new Date(data.Data_Apuracao ? data.Data_Apuracao : data.DATA_APURACAO);

    let dateToShow = this.dataCtrl.fullMonths[date.getMonth()] + ' de ' + date.getFullYear() + ' • Até ' + date.getDate() + '/' + (date.getMonth() + 1);

    let Consumo_De_Material: any = data.Consumo_De_Material * 100;

    let Baixa_De_Material: any = data.Baixa_De_Material * 100;
    let tipo = data.Tipo_Credenciado;
    let minServico = parseFloat(data.MIN_SERVICO);
    let consumoMax = data.Consumo_De_Material_MAX;

    let servicoBars = this.calcBarsPercent(data.MIN_SERVICO, data.MAX_SERVICO, data.Volume_Servicos_PDV);

    let servicoRedWidth = servicoBars.red + '%';
    let servicoGreenWidth = servicoBars.green + '%';
    let servicoValue = parseFloat(data.Volume_Servicos_PDV);

    let consumoBars = this.calcBarsPercent(data.Consumo_De_Material_MAX, (data.Consumo_De_Material_MAX * 2), Consumo_De_Material);

    let consumoRedWidth = consumoBars.red + '%';
    let consumoGreenWidth = consumoBars.green + '%';
    let consumoValue = Consumo_De_Material;

    let breackpoints = [99, 90, 80, 70, 60, 0];
    let revisita: any = parseFloat(Baixa_De_Material);
    let total = this.ptBrNumberFormat(data.total_de_pontos, false);
    let fillerData = [];
    let token;
    breackpoints.forEach(function (v, i) {
      let data: any = {};
      if (revisita < v) {
        data.isHighlight = false;
        fillerData.push(data);
        token = revisita;
      } else {
        data.isHighlight = true;
        fillerData.push(data);
      }
    });
    let position;
    let chartValue = revisita.toFixed(0);
    console.log(chartValue);
    if (position > 100) {
      position = 20;
    } else if (position < 0) {
      position = 0;
    } else {

    }
    let toShowFirst = false;
    if (chartValue >= 80) {
      toShowFirst = true;
      if (chartValue >= 100) {
        position = 23;
      } else if (chartValue >= 90 && chartValue < 100) {
        position = 55;
      } else if (chartValue >= 80 && chartValue < 90) {
        position = 90;
      } else {

      }
    } else {
      toShowFirst = false;
      if (chartValue >= 70 && chartValue < 80) {
        position = 20;
      } else if (chartValue >= 60 && chartValue < 70) {
        position = 55;
      } else if (chartValue < 60) {
        position = 88;
      }
    }

    let listingData = {
      'tipo': tipo,
      'minServico': minServico,
      'consumoMax': consumoMax,
      'servicoRedWidth': servicoRedWidth,
      'servicoGreenWidth': servicoGreenWidth,
      'servicoValue': servicoValue,
      'consumoRedWidth': consumoRedWidth,
      'consumoGreenWidth': consumoGreenWidth,
      'consumoValue': consumoValue,
      'total': total,
      'position': position + '%',
      'services': data.Servicos_Sirius ? data.Servicos_Sirius : '--',
      'fillerData': fillerData,
      'revisita': revisita.toFixed(0),
      'toShowFirst': toShowFirst
    };
    this.publishCustomEvent(broadCastToken, listingData);

  }

  setSuperfisorTelevendasMonthlyData(report, broadCastToken) {
    let data = report[0];
    if (!data) {
      return false;
    }
    let date = new Date(data.Data_Apuracao ? data.Data_Apuracao : data.DATA_APURACAO);
    let dateToShow = this.dataCtrl.fullMonths[date.getMonth()] + ' de ' + date.getFullYear() + ' • Até ' + date.getDate() + '/' + (date.getMonth() + 1);

    let p2PDV = data.P2_PDV * 100;
    let Percentual_Propostas_Pagas = data.Percentual_Propostas_Pagas * 100;
    let rechargePDV = data['2_recarga_PDV'] * 100;
    data.P2_PDV = parseFloat(data.P2_PDV);

    let tipo = data.Tipo_Credenciado;
    let p2Max = data.MAX_P2_PDV;
    let rechargeMin = data.MIN_2_recarga_PDV;
    let propostas = data.MIN_Percentual_Propostas_Pagas;

    var p2Bars = this.calcBarsPercent(data.MAX_P2_PDV, 100, p2PDV);
    let p2Green = p2Bars.red.toFixed(2) + '%';
    let p2Red = p2Bars.green && p2Bars.green < 9 ? '9%' : p2Bars.green + '%';
    let p2Vlaue = p2PDV.toFixed(0);

    let rechargeBars = this.calcBarsPercent(data.MIN_2_recarga_PDV, data.MAX_2_recarga_PDV, rechargePDV);
    let rechargeGreen = rechargeBars.green + '%';
    let rechargeRed = rechargeBars.red + '%';
    let rechargeVlaue = rechargePDV.toFixed(0);

    let propostasBars = this.calcBarsPercent(data.MIN_Percentual_Propostas_Pagas, data.MAX_Percentual_Propostas_Pagas, Percentual_Propostas_Pagas);
    let propostasGreen = propostasBars.green + '%';
    let propostasRed = propostasBars.red + '%';
    let propostasVlaue = Percentual_Propostas_Pagas.toFixed(0);

    let totalDeVendas = data.Vendas_Total_PDV;
    let total = this.ptBrNumberFormat(data.Total_De_Pontos, false);
    let skyPlay = data.Sky_Play_Venda ? this.ptBrNumberFormat(data.Sky_Play_Venda, false) : '--';

    let listingData = {
      'tipo': tipo,
      'p2Max': p2Max,
      'rechargeMin': rechargeMin,
      'propostas': propostas,
      'p2Red': p2Red,
      'p2Green': p2Green,
      'p2Vlaue': parseInt(p2Vlaue),
      'rechargeGreen': rechargeGreen,
      'rechargeRed': rechargeRed,
      'rechargeVlaue': rechargeVlaue,
      'propostasGreen': propostasGreen,
      'propostasRed': propostasRed,
      'propostasVlaue': propostasVlaue,
      'totalDeVendas': totalDeVendas,
      'total': total,
      'Sky_Play_Venda': skyPlay
    };
    this.publishCustomEvent(broadCastToken, listingData);
  }

  setSupervisorDeVendasMonthlyData(report, broadCastToken) {
    let data = report[0];
    if (!data) {
      return false;
    }
    let date = new Date(data.Data_Apuracao ? data.Data_Apuracao : data.DATA_APURACAO);
    let dateToShow = this.dataCtrl.fullMonths[date.getMonth()] + ' de ' + date.getFullYear() + ' • Até ' + date.getDate() + '/' + (date.getMonth() + 1);

    let P2_PDV: any = data.P2_PDV * 100;
    let recarga_PDV: any = data['2_recarga_PDV'] * 100;

    P2_PDV = parseFloat(P2_PDV);
    recarga_PDV = parseFloat(recarga_PDV);

    let tipo = data.Tipo_Credenciado;
    let p2Max = data.MAX_P2_PDV;
    let rechargeMin = data.MIN_2_recarga_PDV;

    let p2Bars = this.calcBarsPercent(data.MAX_P2_PDV, 100, P2_PDV);
    let p2BarsGreen = p2Bars.red + '%';
    let p2BarsRed = p2Bars.green && p2Bars.green < 9 ? '9%' : p2Bars.green + '%';
    let p2BarsValue = P2_PDV.toFixed(0);

    let rechargeBars = this.barFillMinCalculator(data.MIN_2_recarga_PDV, data.MAX_2_recarga_PDV, recarga_PDV / 100);
    let rechargeBarsGreen = rechargeBars.secondPosition + '%';
    let rechargeBarsRed = rechargeBars.firstPosition + '%';
    let rechargeBarsValue = recarga_PDV.toFixed(0);

    let total = this.ptBrNumberFormat(parseFloat(data.Total_De_Pontos), false);
    let totalDeVendas = parseFloat(data.Vendas_Total_PDV).toFixed(0);
    let skyPlay = data.Sky_Play_Venda ? this.ptBrNumberFormat(data.Sky_Play_Venda, false) : '--';

    let listingData = {
      'tipo': tipo,
      'p2Max': p2Max,
      'rechargeMin': parseInt(rechargeMin),
      'p2BarsGreen': p2BarsGreen,
      'p2BarsRed': p2BarsRed,
      'p2BarsValue': parseInt(p2BarsValue),
      'rechargeBarsGreen': rechargeBarsGreen,
      'rechargeBarsRed': rechargeBarsRed,
      'rechargeBarsValue': rechargeBarsValue,
      'totalDeVendas': totalDeVendas,
      'total': total,
      'Sky_Play_Venda': skyPlay
    };
    this.publishCustomEvent(broadCastToken, listingData);
  }

  setSupervisorTecnicoMonthlyData(report, broadCastToken) {
    let data = report[0];
    if (!data) {
      return false;
    }
    let date = new Date(data.Data_Apuracao ? data.Data_Apuracao : data.DATA_APURACAO);
    let dateToShow = this.dataCtrl.fullMonths[date.getMonth()] + ' de ' + date.getFullYear() + ' • Até ' + date.getDate() + '/' + (date.getMonth() + 1);

    let P2_PDV: any = data.P2_PDV * 100;
    let recarga_PDV: any = data['2_recarga_PDV'] *= 100;

    P2_PDV = parseFloat(P2_PDV);
    recarga_PDV = parseFloat(recarga_PDV);

    let tipo = data.Tipo_Credenciado;
    let servicesMin = parseFloat(data.MIN_SERVICO);

    let serviceBars = this.barFillMinCalculator(data.MIN_SERVICO, data.MAX_SERVICO, data.VOLUME_SERVICOS / 100);
    let serviceRed = serviceBars.firstPosition / 10 + '%';
    let serviceGreen = serviceBars.secondPosition / 10 + '%';
    let serviceValue = parseFloat(data.VOLUME_SERVICOS);

    let total = this.ptBrNumberFormat(parseFloat(data.Total_De_Pontos), false);
    var breackpoints = [0, 0.7, 1, 2, 4, 6];
    var revisita: any = parseFloat(data.REVISITA) * 100;
    var defaultBreakPointSpace, token;
    let fillerData = [];

    breackpoints.forEach(function (v, i) {
      let data: any = {};
      if (revisita > v) {
        data.isHighlight = true;
        fillerData.push(data);
        token = revisita;
      } else {
        data.isHighlight = false;
        fillerData.push(data);
        // if (token) {
        //   defaultBreakPointSpace = breackpoints[i] - breackpoints[i - 1];
        //   var widthPercentage = this.performanceBarFillCalculator(revisita.toFixed(0), breackpoints[i - 1], defaultBreakPointSpace);
        //   widthPercentage + '%';
        //   token = '';
        // }
      }
    });

    let revisitaValue;
    var valuePosition = revisita.toFixed(0) * 10;
    if (revisita.toFixed(2) <= 0.70) {
      revisitaValue = revisita.toFixed(1);
    } else {
      revisitaValue = revisita.toFixed(0);
    }
    if (valuePosition > 100) {
      valuePosition = 100;
    } else if (revisita.toFixed(2) > 6) {
      valuePosition = 94;
    } else if (revisita.toFixed(2) > 4) {
      valuePosition = 77;
    } else if (revisita.toFixed(2) > 2) {
      valuePosition = 61;
    } else if (revisita.toFixed(2) > 1) {
      valuePosition = 44;
    } else if (revisita > 0.7) {
      valuePosition = 28;
    } else if (revisita <= 0.7) {
      valuePosition = 11;
    } else if (valuePosition < 0) {
      valuePosition = 0;
    } else {
      valuePosition = valuePosition * 0.97;
    }

    let listingData = {
      'tipo': tipo,
      'servicesMin': servicesMin,
      'serviceRed': serviceRed,
      'serviceGreen': serviceGreen,
      'serviceValue': serviceValue,
      'total': total,
      'fillerData': fillerData,
      'revisita': revisitaValue + '%',
      'position': valuePosition + '%',
      'serviceYes': false,
      'serviceNo': false,
    };

    if (data.fora_politica == 'NAO') {
      listingData.serviceYes = true;
    } else if (data.fora_politica == 'SIM') {
      listingData.serviceNo = true;
    }
    this.publishCustomEvent(broadCastToken, listingData);
  }

  setTecnicoMonthlyData(report, broadCastToken) {
    let data = report[0];
    if (!data) {
      return false;
    }
    let date = new Date(data.Data_Apuracao ? data.Data_Apuracao : data.DATA_APURACAO);
    let dateToShow = this.dataCtrl.fullMonths[date.getMonth()] + ' de ' + date.getFullYear() + ' • Até ' + date.getDate() + '/' + (date.getMonth() + 1);

    data.P2_PDV *= 100;
    data['2_recarga_PDV'] *= 100;

    data.P2_PDV = parseFloat(data.P2_PDV);
    data['2_recarga_PDV'] = parseFloat(data['2_recarga_PDV']);

    let tipo = data.Tipo_Credenciado;
    let serviceMin = parseFloat(data.MIN_SERVICO);
    let conexoesMin = parseFloat(data.MIN_SKY_PLAY);

    let serviceBars = this.barFillMinCalculator((data.MIN_SERVICO / 5) * 2, (data.MAX_SERVICO / 5) * 2, ((data.VOLUME_SERVICOS / 100) / 5) * 2);
    let serviceRed = serviceBars.firstPosition < '9' ? '9%' : serviceBars.firstPosition.toFixed(2) + '%';
    let serviceGreen = serviceBars.secondPosition.toFixed(2) + '%';
    let serviceValue = parseFloat(data.VOLUME_SERVICOS);

    var conexoesBars = this.barFillMinCalculator(data.MIN_SKY_PLAY * 4, data.MAX_SKY_PLAY * 4, (data.CONEXAO_SKY_PLAY * 4) / 100);
    let conexoesRed = conexoesBars.firstPosition.toFixed(2) + '%';
    let conexoesGreen = conexoesBars.secondPosition.toFixed(2) + '%';
    let conexoesValue = parseFloat(data.CONEXAO_SKY_PLAY);
    let Qtde_Vendas = data.Qtde_Vendas ? data.Qtde_Vendas : '0';
    let total = this.ptBrNumberFormat(data.total_de_pontos, false);
    var token;
    var defaultBreakPointSpace;
    var breackpoints = [0, 0.7, 1, 2, 4, 6];
    var revisita: any = parseFloat(data.REVISITA);
    revisita *= 100;
    var classes = ['bg-green-bar', 'btn-green', 'bg-yellow-bar', 'btn-yellow', 'bg-red-bar', 'bg-transparent'];
    let fillerData = [];
    let count = 0;
    breackpoints.forEach(function (v, i) {
      let data: any = {};
      revisita = Math.round(revisita);
      if (revisita > v) {
        data.isHighlight = true;
        fillerData.push(data);
        token = revisita;
        count = count + 1;
      } else {
        data.isHighlight = false;
        fillerData.push(data);
        // if (token) {
        //     defaultBreakPointSpace = breackpoints[i] - breackpoints[i - 1];
        //     var widthPercentage = this.performanceBarFillCalculator(revisita.toFixed(0), breackpoints[i - 1], defaultBreakPointSpace);
        //     token = '';
        // }
      }
    });
    var valuePosition = revisita.toFixed(0) * 10;
    if (valuePosition > 100) {
      valuePosition = 100;
    } else if (revisita.toFixed(2) > 6) {
      valuePosition = 94;
    } else if (revisita.toFixed(2) > 4) {
      valuePosition = 77;
    } else if (revisita.toFixed(2) > 2) {
      valuePosition = 61;
    } else if (revisita.toFixed(2) > 1) {
      valuePosition = 44;
    } else if (revisita > 0.7) {
      valuePosition = 28;
    } else if (revisita <= 0.7) {
      valuePosition = 11;
    } else if (valuePosition <= 0) {
      valuePosition = 7;
    } else {

    }
    let position = (count * 16.6) - 4;

    let listingData = {
      'tipo': tipo,
      'serviceMin': serviceMin,
      'conexoesMin': conexoesMin,
      'serviceRed': serviceRed,
      'serviceGreen': serviceGreen,
      'serviceValue': serviceValue,
      'conexoesRed': conexoesRed,
      'conexoesGreen': conexoesGreen,
      'conexoesValue': conexoesValue,
      'services': data.Servicos_Sirius ? data.Servicos_Sirius : '--',
      'total': total,
      'fillerData': fillerData,
      'revisita': revisita.toFixed(0) + '%',
      'position': valuePosition + '%',
      'serviceYes': false,
      'serviceNo': false,
      'Qtde_Vendas': Qtde_Vendas
    };
    if (valuePosition <= 0) {
      listingData.position = 14 + '%';
      listingData.fillerData[0].isHighlight = true;
    }
    if (data.fora_politica == 'NAO') {
      listingData.serviceYes = true;
    } else if (data.fora_politica == 'SIM') {
      listingData.serviceNo = true;
    }

    this.publishCustomEvent(broadCastToken, listingData);
  }

  setTorreMonthlyData(report, broadCastToken) {
    let data = report[0];
    if (!data) {
      return false;
    }
    let date = new Date(data.Data_Apuracao ? data.Data_Apuracao : data.DATA_APURACAO);
    let dateToShow = this.dataCtrl.fullMonths[date.getMonth()] + ' de ' + date.getFullYear() + ' • Até ' + date.getDate() + '/' + (date.getMonth() + 1);

    let tipo = data.Tipo_Credenciado;
    let serviceMin = parseFloat(data.MIN_SERVICO);

    let serviceBars = this.calcBarsPercent(data.MIN_SERVICO, data.MAX_SERVICO, data.VOLUME_SERVICOS);
    let serviceRed = serviceBars.red;
    let serviceGreen = serviceBars.green;
    let serviceValue = parseFloat(data.VOLUME_SERVICOS);
    let total = this.ptBrNumberFormat(data.TOTAL_DE_PONTOS, false);
    var token;
    var defaultBreakPointSpace;
    var breackpoints = [100, 91, 85, 75, 0];
    var revisita: any = parseFloat(data.IQ); //data.IQ
    revisita *= 100;

    let fillerData = [];

    breackpoints.forEach(function (v, i) {
      let data: any = {};
      if (revisita > v) {
        data.isHighlight = false;
        fillerData.push(data);
        token = revisita;
      } else {
        data.isHighlight = true;
        fillerData.push(data);
        // if (token) {
        //   defaultBreakPointSpace = breackpoints[i - 1] - breackpoints[i];
        //   var widthPercentage = this.performanceBarFillCalculatorSelected(breackpoints[i], revisita.toFixed(0), defaultBreakPointSpace);
        //   token = '';
        // }
      }
    });


    var bar = ((100 - (revisita < 70 ? 70 : revisita)) * 100 / 30);
    let final = (bar - (bar * (bar > 50 ? 10 : 15) / 100)).toFixed(0) + '%';

    if (revisita >= 91) {
      final = '17%';
    } else if (revisita > 85) {
      final = '42%';
    } else if (revisita > 75) {
      final = '65%';
    } else if (revisita <= 75) {
      final = '90%';
    } else {

    }
    let listingData = {
      'tipo': tipo,
      'serviceMin': serviceMin,
      'serviceRed': serviceRed + '%',
      'serviceGreen': serviceGreen + '%',
      'serviceValue': serviceValue,
      'total': total,
      'fillerData': fillerData,
      'revisita': revisita.toFixed(0) + '%',
      'position': final,
      'services': data.Servicos_Sirius ? data.Servicos_Sirius : '--',
      'serviceYes': false,
      'serviceNo': false,
    };

    if (data.fora_politica == 'NAO') {
      listingData.serviceYes = true;
    } else if (data.fora_politica == 'SIM') {
      listingData.serviceNo = true;
    }
    this.publishCustomEvent(broadCastToken, listingData);
  }

  setTelevendasMonthlyData(report, broadCastToken) {
    let data = report[0];

    if (!data) {
      return false;
    }
    let date = new Date(data.Data_Apuracao ? data.Data_Apuracao : data.DATA_APURACAO);
    let dateToShow = this.dataCtrl.fullMonths[date.getMonth()] + ' de ' + date.getFullYear() + ' • Até ' + date.getDate() + '/' + (date.getMonth() + 1);

    let tipo = data.Tipo_Credenciado;
    let p2max = data.MAX_P2;
    let recargaMin = data.MIN_2_recarga;
    let Sky_Play = data.Sky_Play_Venda ? this.ptBrNumberFormat(data.Sky_Play_Venda, false) : '--';

    let p2 = data.P2 * 100;
    let p2Barvalue = parseFloat(p2.toString()).toFixed(0);
    let p2Bar = this.barFillMaxCalculator(data.MIN_P2, data.MAX_P2, data.P2);
    let p2BarSecond = p2Bar.firstPosition + '%';
    let p2BarFirst = p2Bar.secondPosition && p2Bar.secondPosition < '9' ? '9%' : p2Bar.secondPosition + '%';

    let recarga = data.Recarga * 100;
    let recargaBarvalue = parseFloat(recarga.toString()).toFixed(0);
    let recargaBar = this.barFillMinCalculator(data.MIN_2_recarga, data.MAX_2_recarga, data.Recarga);
    let recargaBarSecond = recargaBar.secondPosition;
    let recargaBarFirst = recargaBar.firstPosition;

    let total = this.ptBrNumberFormat(data.Total_De_Pontos, false);
    var token;
    var defaultBreakPointSpace;
    var breackpoints = [0, 4, 9, 14, 19, 24, 29, 34, 39, 44, 49];
    var revisita: any = parseFloat(data.Vendas_Totais);
    let fillerData = [];

    breackpoints.forEach(function (v, i) {
      let data: any = {};
      if (revisita < v) {
        data.isHighlight = false;
        fillerData.push(data);
        token = revisita;
      } else {
        data.isHighlight = true;
        fillerData.push(data);
        // if (token) {
        // defaultBreakPointSpace = breackpoints[i] - breackpoints[i - 1];
        // var widthPercentage = this.performanceBarFillCalculator(breackpoints[i], revisita.toFixed(0), defaultBreakPointSpace);
        // token = '';
        // }
      }
    });
    var valuePosition = revisita.toFixed(0) * 1.8;
    let chartValue = revisita.toFixed(0);
    if (valuePosition > 100) {
      valuePosition = 100;
    } else if (valuePosition < 0) {
      valuePosition = 0;
    } else {

    }
    let toShowFirst = false;
    if (chartValue < 30) {
      toShowFirst = true;
      if (chartValue < 4) {
        valuePosition = 12;
      } else if (chartValue > 4 && chartValue < 10) {
        valuePosition = 28;
      } else if (chartValue > 9 && chartValue < 15) {
        valuePosition = 45;
      } else if (chartValue > 14 && chartValue < 20) {
        valuePosition = 61;
      } else if (chartValue > 19 && chartValue < 25) {
        valuePosition = 78;
      } else if (chartValue > 24 && chartValue < 30) {
        valuePosition = 95;
      } else {

      }
    } else {
      toShowFirst = false;
      if (chartValue > 29 && chartValue < 35) {
        valuePosition = 14;
      } else if (chartValue > 34 && chartValue < 40) {
        valuePosition = 33;
      } else if (chartValue > 39 && chartValue < 45) {
        valuePosition = 53;
      } else if (chartValue > 44 && chartValue < 50) {
        valuePosition = 73;
      } else if (chartValue > 55) {
        valuePosition = 92;
      }
    }
    if (recargaBarvalue > recargaMin) {
      recargaBarFirst = data.MIN_2_recarga;
    }
    let listingData = {
      'tipo': tipo,
      'p2max': p2max,
      'recargaMin': parseFloat(recargaMin),
      'p2BarFirst': p2BarFirst,
      'p2Barvalue': parseInt(p2Barvalue),
      'p2BarSecond': p2BarSecond,
      'recargaBarvalue': parseFloat(recargaBarvalue),
      'recargaBarSecond': recargaBarSecond + '%',
      'recargaBarFirst': recargaBarFirst + '%',
      'total': total,
      'fillerData': fillerData,
      'revisita': revisita.toFixed(0),
      'toShowFirst': toShowFirst,
      'position': valuePosition + '%',
      'Sky_Play_Venda': Sky_Play
    };
    this.publishCustomEvent(broadCastToken, listingData);
  }

  setVendadorInternoMonthlyData(report, broadCastToken) {
    let data = report[0];

    if (!data) {
      return false;
    }
    let date = new Date(data.Data_Apuracao ? data.Data_Apuracao : data.DATA_APURACAO);
    let dateToShow = this.dataCtrl.fullMonths[date.getMonth()] + ' de ' + date.getFullYear() + ' • Até ' + date.getDate() + '/' + (date.getMonth() + 1);

    let tipo = data.Tipo_Credenciado;
    let p2max = data.MAX_P2;
    let recargaMin = data.MIN_2_recarga;
    let p2 = data.P2 * 100;
    let p2Barvalue = parseFloat(p2.toString()).toFixed(0);
    let p2Bar = this.barFillMaxCalculator(data.MIN_P2, data.MAX_P2, data.P2);
    let p2BarSecond = p2Bar.firstPosition + '%';
    let p2BarFirst = p2Bar.secondPosition && p2Bar.secondPosition < '9' ? '9%' : p2Bar.secondPosition + '%';

    let recarga = data.Recarga * 100;
    let recargaBarvalue = parseFloat(recarga.toString()).toFixed(0);
    let recargaBar = this.barFillMinCalculator(data.MIN_2_recarga, data.MAX_2_recarga, data.Recarga);
    let recargaBarSecond = recargaBar.secondPosition;
    let recargaBarFirst = recargaBar.firstPosition;

    let total = this.ptBrNumberFormat(data.Total_De_Pontos, false);
    let Sky_Play = data.Sky_Play_Venda ? this.ptBrNumberFormat(data.Sky_Play_Venda, false) : '--';
    var token;
    var defaultBreakPointSpace;
    var breackpoints = [0, 4, 9, 14, 19, 24, 29, 34, 39, 44, 49];
    var revisita: any = parseFloat(data.Vendas_Totais);
    let fillerData = [];

    breackpoints.forEach(function (v, i) {
      let data: any = {};
      if (revisita <= v) {
        data.isHighlight = false;
        fillerData.push(data);
        token = revisita;
      } else {
        data.isHighlight = true;
        fillerData.push(data);
        // if (token) {
        // defaultBreakPointSpace = breackpoints[i] - breackpoints[i - 1];
        // var widthPercentage = this.performanceBarFillCalculator(breackpoints[i], revisita.toFixed(0), defaultBreakPointSpace);
        // token = '';
        // }
      }
    });
    var valuePosition = revisita.toFixed(0) * 1.8;
    let chartValue = revisita.toFixed(0);
    if (valuePosition > 100) {
      valuePosition = 100;
    } else if (valuePosition < 0) {
      valuePosition = 0;
    } else {

    }
    let toShowFirst = false;
    if (chartValue < 30) {
      toShowFirst = true;
      if (chartValue < 4) {
        valuePosition = 12;
      } else if (chartValue > 4 && chartValue < 10) {
        valuePosition = 28;
      } else if (chartValue > 9 && chartValue < 15) {
        valuePosition = 45;
      } else if (chartValue > 14 && chartValue < 20) {
        valuePosition = 61;
      } else if (chartValue > 19 && chartValue < 25) {
        valuePosition = 78;
      } else if (chartValue > 24 && chartValue < 30) {
        valuePosition = 95;
      } else {

      }
    } else {
      toShowFirst = false;
      if (chartValue > 29 && chartValue < 35) {
        valuePosition = 14;
      } else if (chartValue > 34 && chartValue < 40) {
        valuePosition = 33;
      } else if (chartValue > 39 && chartValue < 45) {
        valuePosition = 53;
      } else if (chartValue > 44 && chartValue < 50) {
        valuePosition = 73;
      } else if (chartValue > 55) {
        valuePosition = 92;
      }
    }
    if (recargaBarvalue > recargaMin) {
      recargaBarFirst = data.MIN_2_recarga;
    }
    let listingData = {
      'tipo': tipo,
      'p2max': p2max,
      'recargaMin': parseFloat(recargaMin),
      'p2BarFirst': p2BarFirst,
      'p2Barvalue': parseInt(p2Barvalue),
      'p2BarSecond': p2BarSecond,
      'recargaBarvalue': parseFloat(recargaBarvalue),
      'recargaBarSecond': recargaBarSecond + '%',
      'recargaBarFirst': recargaBarFirst + '%',
      'total': total,
      'fillerData': fillerData,
      'revisita': revisita.toFixed(0),
      'toShowFirst': toShowFirst,
      'position': valuePosition + '%',
      'Sky_Play_Venda': Sky_Play
    };
    this.publishCustomEvent(broadCastToken, listingData);
  }

  setVendedorMonthlyData(report, broadCastToken) {
    let data = report[0];
    if (!data) {
      return false;
    }
    let date = new Date(data.Data_Apuracao ? data.Data_Apuracao : data.DATA_APURACAO);
    let dateToShow = this.dataCtrl.fullMonths[date.getMonth()] + ' de ' + date.getFullYear() + ' • Até ' + date.getDate() + '/' + (date.getMonth() + 1);

    let tipo = data.Tipo_Credenciado;
    let p2max = data.MAX_P2;
    let recargaMin = data.MIN_2_recarga;
    let p2 = data.P2 * 100;
    let p2Barvalue = parseFloat(p2.toString()).toFixed(0);
    let p2Bar = this.barFillMaxCalculator(data.MIN_P2, data.MAX_P2, data.P2);
    let p2BarSecond = p2Bar.firstPosition + '%';
    let p2BarFirst = p2Bar.secondPosition && p2Bar.secondPosition < '9' ? '9%' : p2Bar.secondPosition + '%';

    let recarga = data.Recarga * 100;
    let recargaBarvalue = parseFloat(recarga.toString()).toFixed(0);
    let recargaBar = this.barFillMinCalculator(data.MIN_2_recarga, data.MAX_2_recarga, data.Recarga);
    let recargaBarSecond = recargaBar.secondPosition;
    let recargaBarFirst = recargaBar.firstPosition;

    let total = this.ptBrNumberFormat(data.Total_De_Pontos, false);
    let Sky_Play = data.Sky_Play_Venda ? this.ptBrNumberFormat(data.Sky_Play_Venda, false) : '--';
    var token;
    var defaultBreakPointSpace;
    var breackpoints = [0, 4, 9, 14, 19, 24, 29, 34, 39, 44, 49];
    var revisita: any = parseFloat(data.Vendas_Totais);
    let fillerData = [];

    breackpoints.forEach(function (v, i) {
      let data: any = {};
      if (revisita <= v) {
        data.isHighlight = false;
        fillerData.push(data);
        token = revisita;
      } else {
        data.isHighlight = true;
        fillerData.push(data);
        // if (token) {
        // defaultBreakPointSpace = breackpoints[i] - breackpoints[i - 1];
        // var widthPercentage = this.performanceBarFillCalculator(breackpoints[i], revisita.toFixed(0), defaultBreakPointSpace);
        // token = '';
        // }
      }
    });
    var valuePosition = revisita.toFixed(0) * 1.8;
    let chartValue = revisita.toFixed(0);
    if (valuePosition > 100) {
      valuePosition = 100;
    } else if (valuePosition < 0) {
      valuePosition = 0;
    } else {

    }
    let toShowFirst = false;
    if (chartValue < 30) {
      toShowFirst = true;
      if (chartValue < 4) {
        valuePosition = 12;
      } else if (chartValue > 4 && chartValue < 10) {
        valuePosition = 28;
      } else if (chartValue > 9 && chartValue < 15) {
        valuePosition = 45;
      } else if (chartValue > 14 && chartValue < 20) {
        valuePosition = 61;
      } else if (chartValue > 19 && chartValue < 25) {
        valuePosition = 78;
      } else if (chartValue > 24 && chartValue < 30) {
        valuePosition = 95;
      } else {

      }
    } else {
      toShowFirst = false;
      if (chartValue > 29 && chartValue < 35) {
        valuePosition = 14;
      } else if (chartValue > 34 && chartValue < 40) {
        valuePosition = 33;
      } else if (chartValue > 39 && chartValue < 45) {
        valuePosition = 53;
      } else if (chartValue > 44 && chartValue < 50) {
        valuePosition = 73;
      } else if (chartValue > 55) {
        valuePosition = 92;
      }
    }

    if (recargaBarvalue > recargaMin) {
      recargaBarFirst = data.MIN_2_recarga;
    }

    let listingData = {
      'tipo': tipo,
      'p2max': p2max,
      'recargaMin': parseInt(recargaMin),
      'p2BarFirst': p2BarFirst,
      'p2Barvalue': parseInt(p2Barvalue),
      'p2BarSecond': p2BarSecond,
      'recargaBarvalue': parseInt(recargaBarvalue),
      'recargaBarSecond': recargaBarSecond + '%',
      'recargaBarFirst': recargaBarFirst + '%',
      'total': total,
      'fillerData': fillerData,
      'revisita': revisita.toFixed(0),
      'toShowFirst': toShowFirst,
      'position': valuePosition + '%',
      'Sky_Play_Venda': Sky_Play
    };
    console.log(listingData.fillerData);
    this.publishCustomEvent(broadCastToken, listingData);
  }

  setAlmoxarifeDistribuidorMonthlyData(report, broadCastToken) {
    let data = report[0];
    if (!data) {
      return false;
    }
    let date = new Date(data.Data_Apuracao ? data.Data_Apuracao : data.DATA_APURACAO);

    let dateToShow = this.dataCtrl.fullMonths[date.getMonth()] + ' de ' + date.getFullYear() + ' • Até ' + date.getDate() + '/' + (date.getMonth() + 1);

    let Consumo_De_Material: any = data.Consumo_De_Material * 100;
    //Baixa_De_Material change for sla_abastecimento
    let Baixa_De_Material: any = data.sla_abastecimento * 100;
    let tipo = data.Tipo_Credenciado;
    let minServico = data.MIN_SERVICO;
    let consumoMax = data.Consumo_De_Material_MAX;

    let servicoBars = this.calcBarsPercent(data.MIN_SERVICO, data.MAX_SERVICO, data.Volume_Servicos_PDV);

    let servicoRedWidth = servicoBars.red + '%';
    let servicoGreenWidth = servicoBars.green + '%';
    let servicoValue = data.Volume_Servicos_PDV;

    let consumoBars = this.calcBarsPercent(data.Consumo_De_Material_MAX, (data.Consumo_De_Material_MAX * 2), Consumo_De_Material);

    let consumoRedWidth = consumoBars.red + '%';
    let consumoGreenWidth = consumoBars.green + '%';
    let consumoValue = Consumo_De_Material;

    let breackpoints = [100, 89, 79, 0];
    let revisita: any = parseFloat(Baixa_De_Material);
    let revisitabar = revisita;
    let total = data.total_de_pontos;
    let fillerData = [];
    if (revisitabar > 100) {
      revisitabar = 100;
    }
    if (revisitabar == 100) {
      fillerData = [
        { 'isHighlight': true },
        { 'isHighlight': false },
        { 'isHighlight': false },
        { 'isHighlight': false },
      ];

    } else {
      breackpoints.forEach(function (v, i) {
        console.log(revisita, v);
        let data: any = {};
        if (revisitabar <= v) {
          data.isHighlight = true;
          fillerData.push(data);
        } else {
          data.isHighlight = false;
          fillerData.push(data);
        }
      });
    }

    let position;
    if (revisita.toFixed(0) < 80) {
      position = 100;
    } else {
      var modulator = revisita.toFixed(0);
      if (modulator >= 90) {
        position = 17;
      } else if (modulator >= 80 && modulator <= 90) {
        position = 54;
      } else {

      }
    }

    let listingData = {
      'tipo': tipo,
      'minServico': minServico,
      'consumoMax': consumoMax,
      'servicoRedWidth': servicoRedWidth,
      'servicoGreenWidth': servicoGreenWidth,
      'servicoValue': servicoValue,
      'consumoRedWidth': consumoRedWidth,
      'consumoGreenWidth': consumoGreenWidth,
      'consumoValue': consumoValue,
      'total': total,
      'position': position + '%',
      'services': data.Servicos_Sirius ? data.Servicos_Sirius : '--',
      'fillerData': fillerData,
      'revisita': revisita.toFixed(0)
    };
    this.publishCustomEvent(broadCastToken, listingData);

  }

  setTorreDistribuidorMonthlyData(report, broadCastToken) {
    let data = report[0];
    if (!data) {
      return false;
    }
    let date = new Date(data.Data_Apuracao ? data.Data_Apuracao : data.DATA_APURACAO);
    let dateToShow = this.dataCtrl.fullMonths[date.getMonth()] + ' de ' + date.getFullYear() + ' • Até ' + date.getDate() + '/' + (date.getMonth() + 1);

    let tipo = data.Tipo_Credenciado;
    let serviceMin = data.MIN_SERVICO;

    let serviceBars = this.calcBarsPercent(data.MIN_SERVICO, data.MAX_SERVICO, data.VOLUME_SERVICOS);
    let serviceRed = serviceBars.red;
    let serviceGreen = serviceBars.green;
    let serviceValue = data.VOLUME_SERVICOS;
    let total = this.ptBrNumberFormat(data.TOTAL_DE_PONTOS, false);
    var token;
    var defaultBreakPointSpace;
    //var breackpoints = [100, 91, 85, 75, 0];
    var breackpoints = [0, 17, 72];
    data.tma_horas = Math.round(data.tma_horas);
    var revisita: any = data.tma_horas ? parseInt(data.tma_horas) : ''; //data.IQ


    let fillerData = [];

    breackpoints.forEach(function (v, i) {
      let data: any = {};
      if (revisita >= v) {
        data.isHighlight = true;
        fillerData.push(data);
        token = revisita;
      } else {
        data.isHighlight = false;
        fillerData.push(data);
        // if (token) {
        //   defaultBreakPointSpace = breackpoints[i - 1] - breackpoints[i];
        //   var widthPercentage = this.performanceBarFillCalculatorSelected(breackpoints[i], revisita.toFixed(0), defaultBreakPointSpace);
        //   token = '';
        // }
      }
    });


    var bar = ((100 - (revisita < 70 ? 70 : revisita)) * 100 / 30);
    let final = (bar - (bar * (bar > 50 ? 10 : 15) / 100)).toFixed(0) + '%';
    console.log(revisita);
    if (revisita >= 72) {
      final = '100%';
    } else if (revisita <= 16) {
      final = '21%';
    } else if (revisita > 16 && revisita < 72) {
      final = '54%';
    } else {

    }
    let listingData = {
      'tipo': tipo,
      'serviceMin': serviceMin,
      'serviceRed': serviceRed + '%',
      'serviceGreen': serviceGreen + '%',
      'serviceValue': serviceValue,
      'total': total,
      'fillerData': fillerData,
      'revisita': revisita.toFixed(0) + 'h',
      'position': final,
      'services': data.Servicos_Sirius ? data.Servicos_Sirius : '--',
      'serviceYes': false,
      'serviceNo': false,
    };

    if (data.fora_politica == 'NAO') {
      listingData.serviceYes = true;
    } else if (data.fora_politica == 'SIM') {
      listingData.serviceNo = true;
    }
    this.publishCustomEvent(broadCastToken, listingData);
  }

  setSupervisorDeVendasDistribuidorMonthlyData(report, broadCastToken) {
    let data = report[0];
    if (!data) {
      return false;
    }
    let date = new Date(data.Data_Apuracao ? data.Data_Apuracao : data.DATA_APURACAO);

    let dateToShow = this.dataCtrl.fullMonths[date.getMonth()] + ' de ' + date.getFullYear() + ' • Até ' + date.getDate() + '/' + (date.getMonth() + 1);

    let Consumo_De_Material: any = data.Consumo_De_Material * 100;
    //Baixa_De_Material change for percent_meta
    let percent_meta: any = data.percent_meta * 100;
    let tipo = data.Tipo_Credenciado;
    let minServico = data.MIN_SERVICO;
    let consumoMax = data.Consumo_De_Material_MAX;

    let servicoBars = this.calcBarsPercent(data.MIN_SERVICO, data.MAX_SERVICO, data.Volume_Servicos_PDV);

    let servicoRedWidth = servicoBars.red + '%';
    let servicoGreenWidth = servicoBars.green + '%';
    let servicoValue = data.Volume_Servicos_PDV;

    let consumoBars = this.calcBarsPercent(data.Consumo_De_Material_MAX, (data.Consumo_De_Material_MAX * 2), Consumo_De_Material);

    let consumoRedWidth = consumoBars.red + '%';
    let consumoGreenWidth = consumoBars.green + '%';
    let consumoValue = Consumo_De_Material;

    //let breackpoints = [100, 89, 79,0];
    let breackpoints = [10, 85, 90, 100, 110];
    let revisita: any = parseFloat(percent_meta);
    let revisitabar = revisita;
    let total = data.Total_De_Pontos;
    let fillerData = [];
    revisitabar = revisitabar.toFixed(0);

    breackpoints.forEach(function (v, i) {

      let data: any = {};
      if (revisitabar >= v) {
        data.isHighlight = true;
        fillerData.push(data);
      } else {
        data.isHighlight = false;
        fillerData.push(data);
      }
    });


    let position;
    if (revisita.toFixed(0) >= 110) {
      position = 100;
    } else {
      var modulator = revisita.toFixed(0);
      if (modulator >= 100 && revisita <= 110) {
        position = 74;
      } else if (modulator >= 90 && modulator <= 100) {
        position = 55;
      } else if (modulator >= 85 && modulator <= 90) {
        position = 35;
      } else if (modulator < 85) {
        position = 17;
      } else {

      }
    }

    let listingData = {
      'tipo': tipo,
      'minServico': minServico,
      'consumoMax': consumoMax,
      'servicoRedWidth': servicoRedWidth,
      'servicoGreenWidth': servicoGreenWidth,
      'servicoValue': servicoValue,
      'consumoRedWidth': consumoRedWidth,
      'consumoGreenWidth': consumoGreenWidth,
      'consumoValue': consumoValue,
      'total': total,
      'position': position + '%',
      'services': data.Servicos_Sirius ? data.Servicos_Sirius : '--',
      'fillerData': fillerData,
      'revisita': revisita.toFixed(0)
    };
    this.publishCustomEvent(broadCastToken, listingData);

  }

  setGerenteDistribuidorMonthlyData(report, broadCastToken) {
    let data = report[0];
    if (!data) {
      return false;
    }
    let date = new Date(data.Data_Apuracao ? data.Data_Apuracao : data.DATA_APURACAO);

    let dateToShow = this.dataCtrl.fullMonths[date.getMonth()] + ' de ' + date.getFullYear() + ' • Até ' + date.getDate() + '/' + (date.getMonth() + 1);

    let Consumo_De_Material: any = data.Consumo_De_Material * 100;
    //Baixa_De_Material change for percent_meta
    let percent_meta: any = data.percent_meta * 100;
    let tipo = data.Tipo_Credenciado;
    let minServico = data.MIN_SERVICO;
    let consumoMax = data.Consumo_De_Material_MAX;

    let servicoBars = this.calcBarsPercent(data.MIN_SERVICO, data.MAX_SERVICO, data.Volume_Servicos_PDV);

    let servicoRedWidth = servicoBars.red + '%';
    let servicoGreenWidth = servicoBars.green + '%';
    let servicoValue = data.Volume_Servicos_PDV;

    let consumoBars = this.calcBarsPercent(data.Consumo_De_Material_MAX, (data.Consumo_De_Material_MAX * 2), Consumo_De_Material);

    let consumoRedWidth = consumoBars.red + '%';
    let consumoGreenWidth = consumoBars.green + '%';
    let consumoValue = Consumo_De_Material;

    //let breackpoints = [100, 89, 79,0];
    let breackpoints = [10, 85, 90, 100, 110];
    let revisita: any = parseFloat(percent_meta);
    let revisitabar = revisita;
    let total = data.Total_De_Pontos;
    let fillerData = [];
    revisitabar = revisitabar.toFixed(0);

    breackpoints.forEach(function (v, i) {

      let data: any = {};
      if (revisitabar >= v) {
        data.isHighlight = true;
        fillerData.push(data);
      } else {
        data.isHighlight = false;
        fillerData.push(data);
      }
    });


    let position;
    if (revisita.toFixed(0) >= 110) {
      position = 100;
    } else {
      var modulator = revisita.toFixed(0);
      if (modulator >= 100 && revisita <= 110) {
        position = 74;
      } else if (modulator >= 90 && modulator <= 100) {
        position = 55;
      } else if (modulator >= 85 && modulator <= 90) {
        position = 35;
      } else if (modulator < 85) {
        position = 17;
      } else {

      }
    }

    //Torre Distribuidor
    var breackpoint = [0, 17, 72];
    var token;

    var tma: any = data.tma_horas ? parseInt(data.tma_horas) : '';


    let fillerData_tma = [];

    breackpoint.forEach(function (v, i) {
      let data: any = {};
      if (tma >= v) {
        data.isHighlight = true;
        fillerData_tma.push(data);
        token = tma;
      } else {
        data.isHighlight = false;
        fillerData_tma.push(data);
        // if (token) {
        //   defaultBreakPointSpace = breackpoints[i - 1] - breackpoints[i];
        //   var widthPercentage = this.performanceBarFillCalculatorSelected(breackpoints[i], revisita.toFixed(0), defaultBreakPointSpace);
        //   token = '';
        // }
      }
    });


    var bar = ((100 - (revisita < 70 ? 70 : revisita)) * 100 / 30);
    let final = (bar - (bar * (bar > 50 ? 10 : 15) / 100)).toFixed(0) + '%';

    if (tma >= 72) {
      final = '100%';
    } else if (tma <= 16) {
      final = '21%';
    } else if (tma > 16 && tma < 72) {
      final = '54%';
    } else {

    }

    //Almoxarife Distribuidor
    let breackpoints_sla = [100, 89, 79, 0];
    let sla_abastecimento: any = data.sla_abastecimento * 100;
    let sla: any = parseFloat(sla_abastecimento);
    let revisitabar_sla = sla;
    let fillerData_sla = [];
    if (revisitabar_sla > 100) {
      revisitabar_sla = 100;
    }
    if (revisitabar_sla == 100) {
      fillerData_sla = [
        { 'isHighlight': true },
        { 'isHighlight': false },
        { 'isHighlight': false },
        { 'isHighlight': false },
      ];

    } else {
      breackpoints_sla.forEach(function (v, i) {

        let data: any = {};
        if (revisitabar_sla <= v) {
          data.isHighlight = true;
          fillerData_sla.push(data);
        } else {
          data.isHighlight = false;
          fillerData_sla.push(data);
        }
      });
    }

    let position_sla;

    if (sla.toFixed(0) < 80) {
      position_sla = 100;
    } else {
      var modulator = sla.toFixed(0);
      if (modulator >= 90) {
        position_sla = 17;
      } else if (modulator >= 80 && modulator <= 90) {
        position_sla = 54;
      } else {

      }
    }

    let listingData = {
      'tipo': tipo,
      'minServico': minServico,
      'consumoMax': consumoMax,
      'servicoRedWidth': servicoRedWidth,
      'servicoGreenWidth': servicoGreenWidth,
      'servicoValue': servicoValue,
      'consumoRedWidth': consumoRedWidth,
      'consumoGreenWidth': consumoGreenWidth,
      'consumoValue': consumoValue,
      'total': total,
      'position': position + '%',
      'services': data.Servicos_Sirius ? data.Servicos_Sirius : '--',
      'fillerData': fillerData,
      'fillerData_tma': fillerData_tma,
      'revisita': revisita.toFixed(0),
      'tma': tma,
      'final': final,
      'sla': sla,
      'position_sla': position_sla + '%',
      'fillerData_sla': fillerData_sla,
    };
    this.publishCustomEvent(broadCastToken, listingData);

  }

  setMultiplicadorElsysMonthlyData(report, broadCastToken) {
    let data = report[0];
    if (!data) {
      return false;
    }
    let date = new Date(data.Data_Apuracao ? data.Data_Apuracao : data.DATA_APURACAO);

    let dateToShow = this.dataCtrl.fullMonths[date.getMonth()] + ' de ' + date.getFullYear() + ' • Até ' + date.getDate() + '/' + (date.getMonth() + 1);

    let Consumo_De_Material: any = data.Consumo_De_Material * 100;
    //Baixa_De_Material change for percent_meta
    let compra_equi: any = data.Ating_Compra_Equip_percent * 100;
    let venda_habilitada: any = data.Ating_Vendas_Hab_percent * 100;
    let tipo = data.Tipo_Credenciado;
    let minServico = data.MIN_SERVICO;
    let consumoMax = data.Consumo_De_Material_MAX;

    let servicoBars = this.calcBarsPercent(data.MIN_SERVICO, data.MAX_SERVICO, data.Volume_Servicos_PDV);

    let servicoRedWidth = servicoBars.red + '%';
    let servicoGreenWidth = servicoBars.green + '%';
    let servicoValue = data.Volume_Servicos_PDV;

    let consumoBars = this.calcBarsPercent(data.Consumo_De_Material_MAX, (data.Consumo_De_Material_MAX * 2), Consumo_De_Material);

    let consumoRedWidth = consumoBars.red + '%';
    let consumoGreenWidth = consumoBars.green + '%';
    let consumoValue = Consumo_De_Material;

    //vendas_hab
    let breackpoints_vendas = [1, 100, 110, 120, 130];
    let vendas_hab: any = parseFloat(venda_habilitada);
    let vendasbar = vendas_hab;
    let fillerData_vendas_hab = [];
    vendasbar = vendasbar.toFixed(0);

    breackpoints_vendas.forEach(function (v, i) {

      let data: any = {};
      if (vendasbar >= v) {
        data.isHighlight = true;
        fillerData_vendas_hab.push(data);
      } else {
        data.isHighlight = false;
        fillerData_vendas_hab.push(data);
      }
    });


    let position_v;

    if (vendas_hab.toFixed(0) >= 130) {
      position_v = 100;
    } else {
      var modulator = vendas_hab.toFixed(0);
      if (modulator >= 120 && vendas_hab < 130) {
        position_v = 76;
      } else if (modulator >= 110 && modulator < 120) {
        position_v = 55;
      } else if (modulator >= 110 && modulator < 110) {
        position_v = 35;
      } else if (modulator < 100) {
        position_v = 17;
      } else {

      }
    }

    //compra_equip

    let breackpoints = [1, 100, 110, 120, 130];
    let revisita: any = parseFloat(compra_equi);
    let revisitabar = revisita;
    let total = data.Total_De_Pontos ? this.ptBrNumberFormat(data.Total_De_Pontos, false) : 0;
    let fillerData = [];
    revisitabar = revisitabar.toFixed(0);

    breackpoints.forEach(function (v, i) {

      let data: any = {};
      if (revisitabar >= v) {
        data.isHighlight = true;
        fillerData.push(data);
      } else {
        data.isHighlight = false;
        fillerData.push(data);
      }
    });


    let position;
    if (revisita.toFixed(0) >= 130) {
      position = 100;
    } else {
      var modulator = revisita.toFixed(0);
      if (modulator >= 120 && revisita < 130) {
        position = 76;
      } else if (modulator >= 110 && modulator < 120) {
        position = 55;
      } else if (modulator >= 110 && modulator < 110) {
        position = 35;
      } else if (modulator < 100) {
        position = 17;
      } else {

      }
    }


    let listingData = {
      'tipo': tipo,
      'minServico': minServico,
      'consumoMax': consumoMax,
      'servicoRedWidth': servicoRedWidth,
      'servicoGreenWidth': servicoGreenWidth,
      'servicoValue': servicoValue,
      'consumoRedWidth': consumoRedWidth,
      'consumoGreenWidth': consumoGreenWidth,
      'consumoValue': consumoValue,
      'total': total,
      'position': position + '%',
      'position_v': position_v + '%',
      'services': data.Servicos_Sirius ? data.Servicos_Sirius : '--',
      'fillerData': fillerData,
      'fillerData_vendas_hab': fillerData_vendas_hab,
      'revisita': revisita.toFixed(0),
      'vendas_hab': vendas_hab.toFixed(0) + '%'
    };
    this.publishCustomEvent(broadCastToken, listingData);

  }

  setProprietarioElsysMonthlyData(report, broadCastToken) {
    let data = report[0];
    if (!data) {
      return false;
    }

    let date = new Date(data.Data_Apuracao ? data.Data_Apuracao : data.DATA_APURACAO);

    let dateToShow = this.dataCtrl.fullMonths[date.getMonth()] + ' de ' + date.getFullYear() + ' • Até ' + date.getDate() + '/' + (date.getMonth() + 1);

    let Consumo_De_Material: any = data.Consumo_De_Material * 100;
    //Baixa_De_Material change for percent_meta
    let compra_equi: any = data.Ating_Compra_Equip_perc * 100;
    let venda_habilitada: any = data.Ating_Vendas_Hab_perc * 100;
    let tipo = data.Tipo_Credenciado;
    let minServico = data.MIN_SERVICO;
    let consumoMax = data.Consumo_De_Material_MAX;

    let servicoBars = this.calcBarsPercent(data.MIN_SERVICO, data.MAX_SERVICO, data.Volume_Servicos_PDV);

    let servicoRedWidth = servicoBars.red + '%';
    let servicoGreenWidth = servicoBars.green + '%';
    let servicoValue = data.Volume_Servicos_PDV;

    let consumoBars = this.calcBarsPercent(data.Consumo_De_Material_MAX, (data.Consumo_De_Material_MAX * 2), Consumo_De_Material);

    let consumoRedWidth = consumoBars.red + '%';
    let consumoGreenWidth = consumoBars.green + '%';
    let consumoValue = Consumo_De_Material;

    //vendas_hab
    let breackpoints_vendas = [1, 100, 110, 120, 130];
    let vendas_hab: any = parseFloat(venda_habilitada);
    let vendasbar = vendas_hab;
    let fillerData_vendas_hab = [];
    vendasbar = vendasbar.toFixed(0);

    breackpoints_vendas.forEach(function (v, i) {

      let data: any = {};
      if (vendasbar >= v) {
        data.isHighlight = true;
        fillerData_vendas_hab.push(data);
      } else {
        data.isHighlight = false;
        fillerData_vendas_hab.push(data);
      }
    });


    let position_v;

    if (vendas_hab.toFixed(0) >= 130) {
      position_v = 100;
    } else {
      var modulator = vendas_hab.toFixed(0);
      if (modulator >= 120 && vendas_hab < 130) {
        position_v = 76;
      } else if (modulator >= 110 && modulator < 120) {
        position_v = 55;
      } else if (modulator >= 110 && modulator < 110) {
        position_v = 35;
      } else if (modulator < 100) {
        position_v = 17;
      } else {

      }
    }

    //compra_equip

    let breackpoints = [1, 100, 110, 120, 130];
    let revisita: any = parseFloat(compra_equi);
    let revisitabar = revisita;
    let total = data.Total_De_Pontos ? this.ptBrNumberFormat(data.Total_De_Pontos, false) : 0;
    let fillerData = [];
    revisitabar = revisitabar.toFixed(0);

    breackpoints.forEach(function (v, i) {

      let data: any = {};
      if (revisitabar >= v) {
        data.isHighlight = true;
        fillerData.push(data);
      } else {
        data.isHighlight = false;
        fillerData.push(data);
      }
    });


    let position;
    if (revisita.toFixed(0) >= 130) {
      position = 100;
    } else {
      var modulator = revisita.toFixed(0);
      if (modulator >= 120 && revisita < 130) {
        position = 76;
      } else if (modulator >= 110 && modulator < 120) {
        position = 55;
      } else if (modulator >= 110 && modulator < 110) {
        position = 35;
      } else if (modulator < 100) {
        position = 17;
      } else {

      }
    }


    let listingData = {
      'tipo': tipo,
      'minServico': minServico,
      'consumoMax': consumoMax,
      'servicoRedWidth': servicoRedWidth,
      'servicoGreenWidth': servicoGreenWidth,
      'servicoValue': servicoValue,
      'consumoRedWidth': consumoRedWidth,
      'consumoGreenWidth': consumoGreenWidth,
      'consumoValue': consumoValue,
      'total': total,
      'position': position + '%',
      'position_v': position_v + '%',
      'services': data.Servicos_Sirius ? data.Servicos_Sirius : '--',
      'fillerData': fillerData,
      'fillerData_vendas_hab': fillerData_vendas_hab,
      'revisita': revisita.toFixed(0),
      'vendas_hab': vendas_hab.toFixed(0) + '%'
    };
    this.publishCustomEvent(broadCastToken, listingData);

  }

  calcBarsPercent(min, max, realizado) {
    var widthRed = 0;
    var maxBarRed = (min * 100) / max;
    var widthGreen = 0;
    var maxBarGreen = 100 - maxBarRed;
    if (realizado >= min) {
      widthRed = maxBarRed;
    } else {
      widthRed = (realizado * maxBarRed) / min;
    }
    var realizado_aux = realizado - min;
    var max_aux = max - min;
    if (realizado_aux <= 0) {
      widthGreen = 0;
    } else {
      widthGreen = (realizado_aux * maxBarGreen) / max_aux;
      if (widthGreen > maxBarGreen) {
        widthGreen = maxBarGreen;
      }
    }

    return {
      red: widthRed,
      green: widthGreen
    };
  }

  barFillMinCalculator(min, max, value) {
    var updatedValue = value * 100;
    var output: any = {};
    if (updatedValue > min) {
      var secondvalue = updatedValue - min;
      output.firstPosition = min;
      output.secondPosition = secondvalue;
    } else {
      output.firstPosition = updatedValue;
      output.secondPosition = 0;
    }
    return output;
  }

  barFillMaxCalculator(min, max, value) {
    var updatedValue = value * 100;
    var output: any = {};
    if (updatedValue > max) {
      var secondvalue = updatedValue - max;
      output.firstPosition = max;
      output.secondPosition = secondvalue;
    } else {
      output.firstPosition = updatedValue;
      output.secondPosition = 0;
    }
    return output;

    // Needed to be kept for future purpose
    // var manipulatedRecharge = value * 100;
    // var manipulatedRechargePosition = (manipulatedRecharge / 100) * (max - min);
    // return manipulatedRechargePosition
  }

  performanceBarFillCalculator(min, value, breakpoint) {
    var positionKey = min % value;
    var positionResult = (positionKey / breakpoint) * 100;
    if (!positionKey.toFixed(0)) {
      positionKey = 100;
    } else if (positionKey > 100) {
      positionKey = 100;
    } else {

    }
    return positionResult;
  }

  publishCustomEvent(eventKey, data?) {
    this.events.publish(eventKey, data ? data : '');
  }

  ptBrNumberFormat(number, isDecimal) {
    if (isDecimal)
      return parseFloat(number).toLocaleString('pt-br', { maximumFractionDigits: 2, minimumFractionDigits: 2 });
    else
      return Number(number).toLocaleString('pt-br', { maximumFractionDigits: 0, minimumFractionDigits: 0 });
  }


  mapUserMissioDetail(userDashboardData, broadCastToken) {
    if (!userDashboardData.role) {
      return false;
    }

    if (userDashboardData.role == 'tecnico') {
      this.setTecnicofeMissio(userDashboardData, broadCastToken);
    } else if (userDashboardData.role == 'retirador') {
      this.setRetiradorMissio(userDashboardData, broadCastToken);
    } else {

    }
  }

  setTecnicofeMissio(report, broadCastToken) {
    var breackpoints = [100, 90, 80, 65, 50];
    var revisita: any = parseFloat(report.sucesso_pdv);
    revisita = revisita * 100;
    let fillerData = [];
    if (revisita >= 100) {
      breackpoints.forEach(function (v, i) {
        let data: any = {};
        if (!i) {
          data.isHighlight = true;
          fillerData.push(data);
        } else {
          data.isHighlight = false;
          fillerData.push(data);
        }
      });
    } else {
      breackpoints.forEach(function (v, i) {
        let data: any = {};
        if (revisita <= v) {
          data.isHighlight = true;
          fillerData.push(data);
        } else {
          data.isHighlight = false;
          fillerData.push(data);
        }
      });
    }

    var positionWidth;
    if (revisita >= 90) {
      positionWidth = '15%';
    } else if (revisita >= 80) {
      positionWidth = "35%";
    } else if (revisita >= 65) {
      positionWidth = "55%";
    } else if (revisita >= 50) {
      positionWidth = "75%";
    } else {
      positionWidth = "95%";
    }

    let listingData = {
      'position': positionWidth,
      'fillerData': fillerData,
      'revisita': revisita.toFixed(0),
    };
    this.publishCustomEvent(broadCastToken, listingData);
  }

  setRetiradorMissio(report, broadCastToken) {
    var breackpoints = [100, 90, 80, 65, 50];
    var revisita: any = parseFloat(report.sucesso_pdv);
    revisita = revisita * 100;
    let fillerData = [];
    if (revisita >= 100) {
      breackpoints.forEach(function (v, i) {
        let data: any = {};
        if (!i) {
          data.isHighlight = true;
          fillerData.push(data);
        } else {
          data.isHighlight = false;
          fillerData.push(data);
        }
      });
    } else {
      breackpoints.forEach(function (v, i) {
        let data: any = {};
        if (revisita <= v) {
          data.isHighlight = true;
          fillerData.push(data);
        } else {
          data.isHighlight = false;
          fillerData.push(data);
        }
      });
    }

    var positionWidth;
    if (revisita >= 90) {
      positionWidth = '15%';
    } else if (revisita >= 80) {
      positionWidth = "35%";
    } else if (revisita >= 65) {
      positionWidth = "55%";
    } else if (revisita >= 50) {
      positionWidth = "75%";
    } else {
      positionWidth = "95%";
    }

    let listingData = {
      'position': positionWidth,
      'fillerData': fillerData,
      'revisita': revisita.toFixed(0),
    };



    this.publishCustomEvent(broadCastToken, listingData);
  }
}
