import React, {Component} from 'react';
import {Modal} from 'antd';
import PageContent from '@/layouts/page-content';
import config from '@/commons/config-hoc';
import {
    ToolBar,
    Table,
    Pagination,
} from '@/library/components';
import EditModal from './EditModal';

@config({
    path: '/user-center',
    ajax: true,
})
export default class UserCenter extends Component {
    state = {
        loading: false,     // 表格加载数据loading
        dataSource: [],     // 表格数据
        selectedRowKeys: [],// 表格中选中行keys
        total: 0,           // 分页中条数
        pageNum: 1,         // 分页当前页
        pageSize: 10,       // 分页每页显示条数
        singleDeleting: {}, // 操作列删除loading
        visible: false,     // 添加、修改弹框
        id: null,           // 需要修改的数据id
    };

    columns = [
        {title: '用户名', dataIndex: 'userName', width: 200},
        {title: '年龄', dataIndex: 'age', width: 200},
        {title: '工作', dataIndex: 'job', width: 200},
        {title: '职位', dataIndex: 'position', width: 200},
        {title: '测试配置文件', dataIndex: 'test', width: 200},
    ];

    componentDidMount() {
        this.handleSearch();
    }

    handleSearch = (e) => {
        e && e.preventDefault();
        if (this.state.loading) return;


            const {pageNum, pageSize} = this.state;
            const params = {
                pageNum,
                pageSize,
            };

            this.setState({loading: true});
            this.props.ajax.get('/user-center', params)
                .then(res => {
                    const dataSource = res?.list || [];
                    const total = res?.total || 0;

                    this.setState({dataSource, total});
                })
                .finally(() => this.setState({loading: false}));
    };


    handleBatchDelete = () => {
        if (this.state.deleting) return;

        const {selectedRowKeys} = this.state;
        const content = (
            <span>
                您确定删除
                <span style={{padding: '0 5px', color: 'red', fontSize: 18}}>
                    {selectedRowKeys.length}
                </span>
                条记录吗？
            </span>
        );
        Modal.confirm({
            title: '温馨提示',
            content,
            onOk: () => {
                this.setState({deleting: true});
                this.props.ajax.del('/user-center', {ids: selectedRowKeys}, {successTip: '删除成功！', errorTip: '删除失败！'})
                    .then(() => this.handleSearch())
                    .finally(() => this.setState({deleting: false}));
            },
        })
    };

    render() {
        const {
            loading,
            deleting,
            dataSource,
            selectedRowKeys,
            total,
            pageNum,
            pageSize,
            visible,
            id,
        } = this.state;

        const disabledDelete = !selectedRowKeys?.length;

        return (
            <PageContent>
                <ToolBar
                    items={[
                        {
                            type: 'primary',
                            icon: 'plus',
                            text: '添加',
                            onClick: () => this.setState({visible: true, id: null}),
                        },
                        {
                            type: 'danger',
                            icon: 'delete',
                            text: '删除',
                            loading: deleting,
                            disabled: disabledDelete,
                            onClick: this.handleBatchDelete,
                        },
                        
                    ]}
                />
                <Table
                    serialNumber
                    rowSelection={{
                        selectedRowKeys,
                        onChange: selectedRowKeys => this.setState({selectedRowKeys}),
                    }}
                    loading={loading}
                    columns={this.columns}
                    dataSource={dataSource}
                    rowKey="id"
                    pagination={false}
                />
                <Pagination
                    total={total}
                    pageNum={pageNum}
                    pageSize={pageSize}
                    onPageNumChange={pageNum => this.setState({pageNum}, this.handleSearch)}
                    onPageSizeChange={pageSize => this.setState({pageSize, pageNum: 1}, this.handleSearch)}
                />
                <EditModal
                    visible={visible}
                    id={id}
                    isEdit={id !== null}
                    onOk={() => this.setState({visible: false}, this.handleSearch)}
                    onCancel={() => this.setState({visible: false})}
                />
            </PageContent>
        );
    }
}
