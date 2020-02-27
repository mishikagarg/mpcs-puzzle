export class ChartModel {
    title: string;
    type: string;
    data: any;
    columnNames: string[];
    options: ChartOptionsModel;
}

class ChartOptionsModel {
    title: string;
    width: string;
    height: string
}