import { TableDataRow } from "../../common/types/Simple";

export class TablePrinter {

    private tableData: TableDataRow[];

    constructor() {
        this.tableData = [];
    }

    public addDataRow(tableData: TableDataRow): TablePrinter {
        this.tableData.push(tableData);
        return this;
    }

    public writeColumn(propertyName: string, propertyValue: string | number) {
        return {
          propertyName,
          propertyValue,
        };
    }

    public printTable(sortByColumn?: number) {
        const tableData = this.tableData.map((row) => {
            const obj: Record<string, string | number> = {};
            for (const [, value] of row.entries()) {
                obj[value.propertyName] = value.propertyValue;
            }
            return obj;
        });

        if (sortByColumn !== undefined) {
            tableData.sort((a, b) => {
                const aValue = a[Object.keys(a)[sortByColumn]];
                const bValue = b[Object.keys(b)[sortByColumn]];
                if (typeof aValue === 'number' && typeof bValue === 'number') {
                    return aValue - bValue;
                } else {
                    return String(aValue).localeCompare(String(bValue));
                }
            });
        }

        console.table(tableData);
    }
}
