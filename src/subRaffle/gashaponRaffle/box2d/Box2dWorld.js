import React, { Component } from "react";
import PropTypes from "prop-types";
import {
  b2World,
  b2Vec2,
  b2BodyDef,
  b2FixtureDef,
  b2Body,
  PolygonShape,
  CircleShape,
  BodyType,
} from "./box2d";
import {
  fromPhysicsToCanvas,
  fromCanvasToPhysics,
  fromCanvasToDom,
  fromDomToCanvas,
  setDomPosition,
  makeEnclosedBox,
  TWO_NUMBERS_OPTIONAL,
} from "./Utils";
import {
  getApproxImpactFromContact,
  getBodyBCategory,
  getBodyACategory,
} from "./ContactUtils";

const Context = React.createContext();
const { Provider, Consumer } = Context;

class Box2dWorld extends Component {
  constructor(props) {
    super(props);
    let {
      width,
      height,
      gravity = [0, 10],
      allowSleep = true,
      scaleFactor = 60,
      enclosed = true,
      enclosureThickness = 3,
      children,
      style = {},
      ...rest
    } = props;
    this.restProps = rest;
    this.SCALE = scaleFactor;

    this.world = new b2World(new b2Vec2(gravity[0], gravity[1]), allowSleep);
    window.world = this.world;
    if (enclosed) {
      makeEnclosedBox(
        width,
        height,
        enclosureThickness,
        this.world,
        this.SCALE
      );
    }

    this.worldChangeStatus = 0;

    this._contactCbProcess = (contact, cb) => {
      let SCALE = this.SCALE;
      const dataA = contact.GetFixtureA().m_body.GetUserData();
      if (dataA) {
        dataA[cb] = true;
      }
      const eventObj = {
        SCALE,
        contact,
      };
      if (dataA && dataA.rc && dataA.rc.props[cb]) {
        eventObj.getOthersCategory = getBodyBCategory;
        dataA.rc.props[cb](eventObj);
      }
      const dataB = contact.GetFixtureB().m_body.GetUserData();
      if (dataB) {
        dataB[cb] = true;
      }
      if (dataB && dataB.rc && dataB.rc.props[cb]) {
        eventObj.getOthersCategory = getBodyACategory;
        dataB.rc.props[cb](eventObj);
      }
    };

    this._contactListener = {
      BeginContact: (contact) => {
        this._contactCbProcess(contact, "onBeginContact");
      },
      EndContact: (contact) => {
        this._contactCbProcess(contact, "onEndContact");
      },
      PreSolve: (contact, oldManifold) => {},
      PostSolve: (contact, impulse) => {},
    };

    this.world.SetContactListener(this._contactListener);

    let worldStyle = {
      width,
      height,
      position: "relative",
      overlow: "hidden",
      boxSizing: "border-box",
      padding: enclosureThickness,
    };
    this.worldStyle = { ...worldStyle, ...style };
  }

  renderPhysics = () => {
    for (let b = this.world.m_bodyList; b; b = b.m_next) {
      if (!b.IsAwake()) {
        continue;
      }

      let userData = b.GetUserData();

      if (userData && userData.dom) {
        if (userData.removed) {
          this.world.DestroyBody(b);
        } else {
          let { x, y } = b.GetPosition();
          let angle = b.GetAngle();
          if (userData.rc) {
            setDomPosition(
              userData.dom,
              userData.rc.width,
              userData.rc.height,
              x,
              y,
              angle,
              this.SCALE
            );
          }
        }
      }
    }
  };

  physLoop = () => {
    this.rafId = undefined;
    this.world.Step(1 / 60, 10, 10);
    this.world.ClearForces();
    this.renderPhysics();
    this.physLoopStart();
  };

  physLoopStart = () => {
    if (!this.rafId) {
      this.rafId = window.requestAnimationFrame(this.physLoop);
    }
  };

  componentDidMount() {
    this.physLoopStart();
  }

  componentWillUnmount() {
    if (this.rafId) {
      window.cancelAnimationFrame(this.rafId);
      this.rafId = undefined;
    }
  }

  render() {
    let { className = "Box2dWorld", children } = this.props;

    return (
      <div className={className} {...this.restProps} style={this.worldStyle}>
        <Provider value={this}>{children}</Provider>
      </div>
    );
  }
}

Box2dWorld.propTypes = {
  width: PropTypes.number.isRequired,
  height: PropTypes.number.isRequired,
  gravity: TWO_NUMBERS_OPTIONAL,
  enclosed: PropTypes.bool,
  allowSleep: PropTypes.bool,
  scaleFactor: PropTypes.number,
  enclosureThickness: PropTypes.number,
};

export { Context };

export default Box2dWorld;
