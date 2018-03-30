import * as _ from 'lodash';
import { Common } from '../../common';
import { MapDom } from '../map-dom';
import { Directive } from './directive.interface';

export class CPStyle implements Directive {

    private element: any;
    private map: MapDom;
    private attribute;
    private elementComment;
    private elmScope;

    constructor(_element: HTMLElement, _map: MapDom) {
        this.element = _element;
        this.element['cpStyle'] = this;
        this.map = _map;
        this.attribute = Common.getAttributeCpStyle(this.element);
        this.elementComment = document.createComment('cpStyle ' + this.attribute);
        this.elmScope = Common.getScope(_element);
    }

    public create() {
        this.init();
    }

    public setStyleByObject(style) {
        if (style && window['capivara'].isObject(style)) {
            Object.keys(style).forEach((key) => {
                this.element.style.setProperty(key.replace(/ /g, ''), style[key]);
            });
        }
    }

    public init() {
        try {
            this.attribute.split(',')
                .map((attr) => {
                    return {
                        key: attr.substring(0, attr.indexOf(':')).replace(/'/g, "").replace(/"/, '').replace(/{/g, '').replace(/}/, ''),
                        value: Common.evalInContext(attr.substring(attr.indexOf(':') + 1, attr.length).replace(/{/g, '').replace(/}/, ''), Common.getScope(this.element).scope),
                    };
                })
                .forEach((style) => {
                    if  (window['capivara'].isString(style.value)) {
                        this.element.style.setProperty(style.key.replace(/ /g, ''), style.value);
                    } else {
                        this.setStyleByObject(style.value);
                    }
                });
        } catch (e) {
            this.setStyleByObject(Common.executeFunctionCallback(this.element, this.attribute));
        }
    }
}
