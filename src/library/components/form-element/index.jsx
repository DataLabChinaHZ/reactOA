import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {
    Form,
    InputNumber,
    Input,
    Select,
    TreeSelect,
    Checkbox,
    Radio,
    Switch,
    DatePicker,
    TimePicker,
    Cascader,
    Icon,
    Tooltip,
    Transfer,
} from 'antd';
import IconPicker from '../icon-picker';
import './index.less';

const {TextArea, Password} = Input;
const FormItem = Form.Item;

// input hidden number textarea password mobile email select select-tree checkbox checkbox-group radio radio-group switch date time date-time date-range cascader

/**
 * 类似 input 元素
 * @param type
 * @returns {boolean}
 */
export function isInputLikeElement(type) {
    return [
        'input',
        'hidden',
        'number',
        'textarea',
        'password',
        'mobile',
        'email',
        'json',
    ].includes(type);
}

function getElement(item) {
    const {type = 'input', component, ...props} = item;

    const commonProps = {
        size: 'default',
    };
    // 样式
    // const width = props.width || '100%';
    // const elementCommonStyle = {width};
    // props.style = props.style ? {...elementCommonStyle, ...props.style} : elementCommonStyle;

    // 如果 component 存在，说明是自定义组件
    if (component) {
        return typeof component === 'function' ? component() : component;
    }

    if (isInputLikeElement(type)) {
        if (type === 'number') return <InputNumber {...commonProps} {...props}/>;
        if (type === 'textarea') return <TextArea {...commonProps} {...props}/>;
        if (type === 'password') return <Password {...commonProps} {...props}/>;

        return <Input {...commonProps} type={type} {...props}/>;
    }

    if (type === 'select') {
        const {options = [], ...others} = props;

        return (
            <Select {...commonProps} {...others}>
                {
                    options.map(opt => <Select.Option key={opt.value} {...opt}>{opt.label}</Select.Option>)
                }
            </Select>
        );
    }

    if (type === 'select-tree') return <TreeSelect {...commonProps} {...props} treeData={props.options}/>;

    if (type === 'checkbox') return <Checkbox {...commonProps} {...props}>{props.label}</Checkbox>;
    if (type === 'checkbox-group') return <Checkbox.Group {...commonProps} {...props}/>;

    if (type === 'radio') return <Radio {...commonProps} {...props}>{props.label}</Radio>;
    if (type === 'radio-group') return <Radio.Group {...commonProps} {...props}/>;
    if (type === 'radio-button') {
        const {options = [], ...others} = props;
        return (
            <Radio.Group buttonStyle="solid" {...commonProps} {...others}>
                {options.map(opt => <Radio.Button key={opt.value} {...opt}>{opt.label}</Radio.Button>)}
            </Radio.Group>
        );
    }

    if (type === 'cascader') return <Cascader {...commonProps} {...props}/>;

    if (type === 'switch') return <Switch {...commonProps} {...props} style={{...props.style, width: 'auto'}}/>;

    if (type === 'date') return <DatePicker {...commonProps} {...props}/>;

    if (type === 'date-time') return <DatePicker {...commonProps} showTime {...props}/>;

    if (type === 'date-range') return <DatePicker.RangePicker {...commonProps} {...props}/>;

    if (type === 'month') return <DatePicker.MonthPicker {...commonProps} {...props}/>;

    if (type === 'time') return <TimePicker {...commonProps} {...props}/>;

    if (type === 'transfer') return <Transfer {...commonProps} {...props}/>;

    if (type === 'icon-picker') return <IconPicker {...commonProps} {...props}/>;

    throw new Error(`no such type: ${type}`);
}

class FormElement extends Component {
    static propTypes = {
        // 自定义属性
        form: PropTypes.object,
        type: PropTypes.string.isRequired,
        labelWidth: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
        width: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
        labelTip: PropTypes.any,
        tip: PropTypes.any,
        field: PropTypes.string,
        decorator: PropTypes.object,
        style: PropTypes.object, // 最外层元素样式
        elementStyle: PropTypes.object, // 表单元素样式
        layout: PropTypes.bool,
        noSpace: PropTypes.bool, // 是否允许用户输入空格
        trim: PropTypes.bool, // 自动去除前后空格
        // 校验相关
        maxLength: PropTypes.number, // 允许输入最大字符数
        minLength: PropTypes.number, // 允许输入最小字符数

        // Form.Item属性
        colon: PropTypes.any,
        extra: PropTypes.any,
        hasFeedback: PropTypes.any,
        help: PropTypes.any,
        label: PropTypes.any,
        labelCol: PropTypes.any,
        required: PropTypes.any,
        validateStatus: PropTypes.any,
        wrapperCol: PropTypes.any,

        // decorator属性 展开方便使用
        getValueFromEvent: PropTypes.any,
        initialValue: PropTypes.any,
        normalize: PropTypes.any,
        preserve: PropTypes.any,
        rules: PropTypes.any,
        trigger: PropTypes.any,
        validateFirst: PropTypes.any,
        validateTrigger: PropTypes.any,
        valuePropName: PropTypes.any,

        // 其他
        className: PropTypes.any,
        onChange: PropTypes.any,
        onClick: PropTypes.any,
        onBlur: PropTypes.any,
        autoFocus: PropTypes.any,
        htmlType: PropTypes.any,
    };

    static defaultProps = {
        type: 'input',
        style: {},
        elementStyle: {},
        layout: false,
        noSpace: false,
        trim: true,
        getValueFromEvent: e => {
            if (!e || !e.target) {
                return e;
            }
            const {target} = e;
            return target.type === 'checkbox' ? target.checked : target.value;
        },
    };

    componentDidMount() {
        this.setStyle();
        const {layout, field, form} = this.props;
        if (!layout && !form) {
            console.error('warning: FormElement 缺少form属性');
        }

        if (!layout && !field) {
            console.error('warning: FormElement 缺少Field属性');
        }
    }

    componentDidUpdate() {
        this.setStyle();
    }

    setStyle = () => {
        let {labelWidth, label, labelBlock, layout} = this.props;

        if (layout && !label) label = ' ';

        const labelDom = this.container.querySelector('.ant-form-item-label');

        if (!label) labelWidth = 0;

        if (labelDom) {
            if (labelWidth !== void 0) {
                const width = typeof labelWidth === 'string' ? labelWidth : `${labelWidth}px`;

                if (labelBlock) {
                    labelDom.style.width = width;
                } else {
                    labelDom.style.flexBasis = width;
                }
            } else {
                labelDom.style.paddingLeft = '0';
            }
        }

        // label自己独占一行
        if (labelBlock) {
            const formItemDom = this.container.querySelector('.ant-form-item');
            formItemDom.style.flexDirection = 'column';
        }
    };

    // 获取校验信息
    getRules = (decorator, placeholder) => {
        const decoratorRues = decorator.rules || [];
        const {
            required,
            maxLength,
            minLength,
        } = this.props;

        const rules = [...decoratorRues];

        // 如果存在required属性，自动添加必填校验
        if (required && !rules.find(item => 'required' in item)) {
            rules.push({required: true, message: `${placeholder}!`});
        }

        if (maxLength !== void 0 && !rules.find(item => 'max' in item)) {
            rules.push({max: maxLength, message: `最大长度不能超过 ${maxLength} 个字符！`});
        }

        if (minLength !== void 0 && !rules.find(item => 'min' in item)) {
            rules.push({min: minLength, message: `最小长度不能低于 ${minLength} 个字符！`});
        }

        return rules;
    };

    trimST = 0;

    render() {
        let {
            // 自定义属性
            form,
            type = 'input',
            labelWidth,
            width, // 整体宽度，默认 100%
            labelTip,
            tip,
            field,
            decorator,
            style,
            elementStyle,
            layout,
            forwardedRef,
            noSpace,
            trim,
            // 校验相关
            maxLength,
            minLength,

            // Form.Item属性
            colon,
            extra,
            hasFeedback,
            help,
            label,
            labelCol,
            required,
            validateStatus,
            wrapperCol,

            // decorator属性 展开方便使用
            getValueFromEvent,
            initialValue,
            normalize,
            preserve,
            rules,
            trigger,
            validateFirst,
            validateTrigger,
            valuePropName,
            onChange,

            children,

            // 其他的会直接作为Form Element属性
            ...others
        } = this.props;

        if (layout) {
            form = null;
            label = ' ';
            colon = false;
        }

        const {getFieldDecorator} = form || {};

        const getValueFromEventNoSpace = noSpace ? (e) => {
            if (isInputLikeElement(type)) {
                let value = (!e || !e.target) ? e : e.target.value;

                if (value && typeof value === 'string') return value.replace(/\s/g, '');

                return value;
            } else {
                return getValueFromEvent(e);
            }
        } : getValueFromEvent;

        const getValueFromEventTrim = trim ? (e) => {
            if (this.trimST) clearTimeout(this.trimST);

            const value = (!e || !e.target) ? e : e.target.value;

            if (
                form
                && isInputLikeElement(type)
                && value
                && typeof value === 'string'
                && (value.startsWith(' ') || value.endsWith(' '))
            ) {
                // 延迟去除，否则用户无法输入空格
                this.trimST = window.setTimeout(() => {
                    form.setFieldsValue({[field]: value.trim()});
                }, 1000);
            }

            return getValueFromEventNoSpace(e);
        } : getValueFromEventNoSpace;

        const nextDecorator = {
            getValueFromEvent: getValueFromEventTrim,
            initialValue,
            normalize,
            preserve,
            rules,
            trigger,
            validateFirst,
            validateTrigger,
            valuePropName,
            onChange,

            ...decorator,
        };

        if (type === 'switch') {
            nextDecorator.valuePropName = 'checked';
        }

        if (type === 'transfer') {
            nextDecorator.valuePropName = 'targetKeys';
        }

        // 删除undefined属性，否则会引发错误
        Object.keys(nextDecorator).forEach(key => {
            const value = nextDecorator[key];
            if (value === void 0) {
                Reflect.deleteProperty(nextDecorator, key);
            }
        });

        // 处理整体样式
        const wrapperStyle = {};
        if (width !== void 0) {
            wrapperStyle.width = width;
            wrapperStyle.flexBasis = width;
            wrapperStyle.flexGrow = 0;
            wrapperStyle.flexShrink = 0;
        } else {
            wrapperStyle.flex = 1;
        }

        // 处理元素样式
        let eleStyle = {width: '100%'};
        eleStyle = {...eleStyle, ...elementStyle};

        // 处理placeholder
        // 处理placeholder
        if (!('placeholder' in others)) {
            if (isInputLikeElement(type)) {
                others.placeholder = `请输入${label}`;
            } else if (type === 'date-range') {
                others.placeholder = ['开始日期', '结束日期'];
            } else {
                others.placeholder = `请选择${label}`;
            }
        }

        if (!('allowClear' in others)) {
            others.allowClear = true;
        }

        nextDecorator.rules = this.getRules(nextDecorator, others.placeholder);

        let formLabel = label;
        if (labelTip) {
            formLabel = (
                <span>
                    <Tooltip
                        placement="bottom"
                        title={labelTip}
                    >
                        <Icon type="question-circle-o" style={{marginRight: '4px'}}/>
                    </Tooltip>
                    {label}
                </span>
            );
        }

        const elementProps = {
            ...others, ref: forwardedRef, style: eleStyle,
        };

        if (form) {
            children = children ? React.cloneElement(children, elementProps) : null;
            children = getFieldDecorator(field, nextDecorator)(children || getElement({type, ...elementProps}));
        }

        return (
            <div
                style={{display: type === 'hidden' ? 'none' : 'flex', ...wrapperStyle, ...style}}
                className="form-element-flex-root"
                ref={node => this.container = node}
            >
                <FormItem
                    colon={colon}
                    extra={extra}
                    hasFeedback={hasFeedback}
                    help={help}
                    label={formLabel}
                    labelCol={labelCol}
                    required={required}
                    validateStatus={validateStatus}
                    wrapperCol={wrapperCol}
                >
                    {children}
                </FormItem>
                {tip ? <div className="font-element-tip">{tip}</div> : null}
            </div>
        );
    }
}

export default React.forwardRef((props, ref) => {
    return <FormElement {...props} forwardedRef={ref}/>;
});
