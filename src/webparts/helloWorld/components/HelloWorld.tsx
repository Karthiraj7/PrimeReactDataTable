// helloworld.tsx

import * as  React from 'react';
import { classNames } from 'primereact/utils';
import { FilterMatchMode } from 'primereact/api';
import { DataTable, DataTableFilterMeta } from 'primereact/datatable';
import { Column, ColumnFilterElementTemplateOptions } from 'primereact/column';
import { InputText } from 'primereact/inputtext';
import { IconField } from 'primereact/iconfield';
import { InputIcon } from 'primereact/inputicon';
import { Dropdown, DropdownChangeEvent } from 'primereact/dropdown';
import { MultiSelect, MultiSelectChangeEvent } from 'primereact/multiselect';
import { Tag } from 'primereact/tag';
import { TriStateCheckbox, TriStateCheckboxChangeEvent } from 'primereact/tristatecheckbox';
import { CustomerService } from './CustomerService';
import { IHelloWorldProps } from './IHelloWorldProps';
interface Representative {
  name: string;
  image: string;
}

interface Country {
  name: string;
  code: string;
}

interface Customer {
  id: number;
  name: string;
  country: Country;
  company: string;
  date: string;
  status: string;
  verified: boolean;
  activity: number;
  representative: Representative;
  balance: number;
}

interface HelloWorldState {
  customers: Customer[];
  filters: DataTableFilterMeta;
  loading: boolean;
  globalFilterValue: string;
  representatives: Representative[];
  statuses: string[];
}

class HelloWorld extends React.Component<{}, HelloWorldState,IHelloWorldProps> {
  constructor(props: any) {
    super(props);

    this.state = {
      customers: [],
      filters: {
        global: { value: null, matchMode: FilterMatchMode.CONTAINS },
        name: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
        'country.name': { value: null, matchMode: FilterMatchMode.STARTS_WITH },
        representative: { value: null, matchMode: FilterMatchMode.IN },
        status: { value: null, matchMode: FilterMatchMode.EQUALS },
        verified: { value: null, matchMode: FilterMatchMode.EQUALS }
      },
      loading: true,
      globalFilterValue: '',
      representatives: [
        { name: 'Amy Elsner', image: 'amyelsner.png' },
        { name: 'Anna Fali', image: 'annafali.png' },
        { name: 'Asiya Javayant', image: 'asiyajavayant.png' },
        { name: 'Bernardo Dominic', image: 'bernardodominic.png' },
        { name: 'Elwin Sharvill', image: 'elwinsharvill.png' },
        { name: 'Ioni Bowcher', image: 'ionibowcher.png' },
        { name: 'Ivan Magalhaes', image: 'ivanmagalhaes.png' },
        { name: 'Onyama Limba', image: 'onyamalimba.png' },
        { name: 'Stephen Shaw', image: 'stephenshaw.png' },
        { name: 'XuXue Feng', image: 'xuxuefeng.png' }
      ],
      statuses: ['unqualified', 'qualified', 'new', 'negotiation', 'renewal']
    };
  }

  componentDidMount() {
    CustomerService.getCustomersMedium().then((data: Customer[]) => {
      this.setState({
        customers: this.getCustomers(data),
        loading: false
      });
    });
  }

  getCustomers(data: Customer[]) {
    return [...(data || [])].map((d) => {
      // @ts-ignore
      d.date = new Date(d.date);
      return d;
    });
  }

  getSeverity(status: string) {
    switch (status) {
      case 'unqualified':
        return 'danger';
      case 'qualified':
        return 'success';
      case 'new':
        return 'info';
      case 'negotiation':
        return 'warning';
      case 'renewal':
        return null;
      default:
        return null;
    }
  }

  onGlobalFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    let { filters } = this.state;
    filters = { ...filters, global: { value, matchMode: FilterMatchMode.CONTAINS } };
    this.setState({ filters, globalFilterValue: value });
  };

  renderHeader = () => {
    return (
      <div className="flex justify-content-end">
        <IconField iconPosition="left">
          <InputIcon className="pi pi-search" />
          <InputText
            value={this.state.globalFilterValue}
            onChange={this.onGlobalFilterChange}
            placeholder="Keyword Search"
          />
        </IconField>
      </div>
    );
  };

  countryBodyTemplate = (rowData: Customer) => {
    return (
      <div className="flex align-items-center gap-2">
        <img
          alt="flag"
          src="https://primefaces.org/cdn/primereact/images/flag/flag_placeholder.png"
          className={`flag flag-${rowData.country.code}`}
          style={{ width: '24px' }}
        />
        <span>{rowData.country.name}</span>
      </div>
    );
  };

  representativeBodyTemplate = (rowData: Customer) => {
    const representative = rowData.representative;
    return (
      <div className="flex align-items-center gap-2">
        <img
          alt={representative.name}
          src={`https://primefaces.org/cdn/primereact/images/avatar/${representative.image}`}
          width="32"
        />
        <span>{representative.name}</span>
      </div>
    );
  };

  representativesItemTemplate = (option: Representative) => {
    return (
      <div className="flex align-items-center gap-2">
        <img
          alt={option.name}
          src={`https://primefaces.org/cdn/primereact/images/avatar/${option.image}`}
          width="32"
        />
        <span>{option.name}</span>
      </div>
    );
  };

  statusBodyTemplate = (rowData: Customer) => {
    return <Tag value={rowData.status} severity={this.getSeverity(rowData.status)} />;
  };

  statusItemTemplate = (option: string) => {
    return <Tag value={option} severity={this.getSeverity(option)} />;
  };

  verifiedBodyTemplate = (rowData: Customer) => {
    return (
      <i
        className={classNames('pi', {
          'true-icon pi-check-circle': rowData.verified,
          'false-icon pi-times-circle': !rowData.verified
        })}
      />
    );
  };

  representativeRowFilterTemplate = (options: ColumnFilterElementTemplateOptions) => {
    return (
      <MultiSelect
        value={options.value}
        options={this.state.representatives}
        itemTemplate={this.representativesItemTemplate}
        onChange={(e: MultiSelectChangeEvent) => options.filterApplyCallback(e.value)}
        optionLabel="name"
        placeholder="Any"
        className="p-column-filter"
        maxSelectedLabels={1}
        style={{ minWidth: '14rem' }}
      />
    );
  };

  statusRowFilterTemplate = (options: ColumnFilterElementTemplateOptions) => {
    return (
      <Dropdown
        value={options.value}
        options={this.state.statuses}
        onChange={(e: DropdownChangeEvent) => options.filterApplyCallback(e.value)}
        itemTemplate={this.statusItemTemplate}
        placeholder="Select One"
        className="p-column-filter"
        showClear
        style={{ minWidth: '12rem' }}
      />
    );
  };

  verifiedRowFilterTemplate = (options: ColumnFilterElementTemplateOptions) => {
    return <TriStateCheckbox value={options.value} onChange={(e: TriStateCheckboxChangeEvent) => options.filterApplyCallback(e.value)} />;
  };

  render() {
    const header = this.renderHeader();

    return (
      <div className="card">
        <DataTable
          value={this.state.customers}
          paginator
          rows={10}
          dataKey="id"
          filters={this.state.filters}
          filterDisplay="row"
          loading={this.state.loading}
          globalFilterFields={['name', 'country.name', 'representative.name', 'status']}
          header={header}
          emptyMessage="No customers found."
        >
          <Column field="name" header="Name" filter filterPlaceholder="Search by name" style={{ minWidth: '12rem' }} />
          <Column
            header="Country"
            filterField="country.name"
            style={{ minWidth: '12rem' }}
            body={this.countryBodyTemplate}
            filter
            filterPlaceholder="Search by country"
          />
          <Column
            header="Agent"
            filterField="representative"
            showFilterMenu={false}
            filterMenuStyle={{ width: '14rem' }}
            style={{ minWidth: '14rem' }}
            body={this.representativeBodyTemplate}
            filter
            filterElement={this.representativeRowFilterTemplate}
          />
          <Column
            field="status"
            header="Status"
            showFilterMenu={false}
            filterMenuStyle={{ width: '14rem' }}
            style={{ minWidth: '12rem' }}
            body={this.statusBodyTemplate}
            filter
            filterElement={this.statusRowFilterTemplate}
          />
          <Column
            field="verified"
            header="Verified"
            dataType="boolean"
            style={{ minWidth: '8rem' }}
            body={this.verifiedBodyTemplate}
            filter
            filterElement={this.verifiedRowFilterTemplate}
          />
        </DataTable>
      </div>
    );
  }
}

export default HelloWorld;
