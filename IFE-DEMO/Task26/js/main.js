/**
 * Created by 周游 on 2016/5/9.
 */
(function () {
    /**
     *
     * @param id 轨道号
     * @param energy 当前能源
     * @param speed 飞行速度
     * @param consume 能源消耗速度
     * @param recover 能源恢复速度
     * @param status 飞船的状态 stop fly destroy
     * @param deg 飞船的位置 0 是正上方
     * @constructor
     */
    function Planet(id, energy, speed, consume, recover, status, deg) {
        this.id = id || 1;
        this.energy = energy || 100;
        this.speed = speed || 5;
        this.consume = consume || 5;
        this.recover = recover || 2;
        this.status = status || "stop";
        this.deg = deg || 0;
        this.interval = null;
        this.mediator = null;
    }

//动力系统

    Planet.prototype.dynamicSystem = function () {
        var self = this;
        var fly = function () {
            self.interval = setInterval(function () {
                self.deg += self.speed;
                if (self.deg >= 360) {
                    self.deg = 0;
                }
                annimationUtil.fly(self.id, self.deg, self.energy);
            }, 100);
            consoleUtil.show("飞船 No" + self.id + "正在飞行");
        };
        var stop = function () {
            clearInterval(self.interval);
            annimationUtil.stop(self.id, self.energy);
            consoleUtil.show("飞船 No" + self.id + "停止飞行");
        };

        return {
            fly: fly,
            stop: stop
        };
    };

//能源系统

    Planet.prototype.energySystem = function () {
        var self = this;
        var charge = function () {
            var chargeRate = self.recover;
            var timer = setInterval(function () {
                if (self.status == "fly" || self.status == "destroy") {
                    clearInterval(timer);
                    return false;
                }
                if (self.energy >= 100) {
                    clearInterval(timer);
                    self.energy = 100;
                    return false;
                }
                self.energy += chargeRate;
                annimationUtil.updateEnergy(self.id, self.energy);
            }, 500);
            consoleUtil.show("飞船 No" + self.id + "正在充能");
        }
        var uncharge = function () {
            var unchargeRate = self.consume;
            var timer = setInterval(function () {
                if (self.status == "stop" || self.status == "destroy") {
                    clearInterval(timer);
                    return false;
                }
                if (self.energy <= 0) {
                    clearInterval(timer);
                    self.energy = 0;
                    self.stateSystem().chageState("stop");
                    return false;
                }
                self.energy -= unchargeRate;
                annimationUtil.updateEnergy(self.id, self.energy);
            }, 500);
            consoleUtil.show("飞船 No" + self.id + "停止充能");
        }
        return {
            charge: charge,
            uncharge: uncharge
        };
    }

// 状态系统

    Planet.prototype.stateSystem = function () {
        var self = this;
        var states = {
            fly: function () {
                self.status = "fly";
                self.dynamicSystem().fly();
                self.energySystem().uncharge();
            },
            stop: function () {
                self.status = "stop";
                self.dynamicSystem().stop();
                self.energySystem().charge();
            },
            destroy: function () {
                self.status = "destroy";
                self.dynamicSystem().stop();
                self.energySystem().charge();
                self.mediator.destroy(self);
                annimationUtil.destroy(self.id);
            }
        };
        var chageState = function (state) {
            states[state]();
            consoleUtil.show("飞船 No" + self.id + "的状态是" + self.status);
        };
        return {
            chageState: chageState
        };
    }
// 信号系统
    Planet.prototype.signalSystem = function () {
        var self = this;
        return {
            receive: function (msg, from) {
                if (self.status != msg.cmd && self.id == msg.id) {
                    self.stateSystem().chageState(msg.cmd);
                }
            }
        }
    }


    /**
     * 指挥员类
     * */
    var Commander = function () {
        this.id = "Zy";
        this.msgs = [];
        this.mediator = null;
    }
    Commander.prototype.send = function (msg) {
        this.mediator.send(msg);
        this.msgs.push(msg);
    }

    var Mediator = function () {
        var planets = [];
        return {
            register: function (obj) {
                if (obj instanceof  Commander) {
                    this.commander = obj;
                    obj.mediator = this;
                    consoleUtil.show("指挥官是" + obj.id);
                    return true;
                }
                if (obj instanceof  Planet) {
                    planets[obj.id] = obj;
                    obj.mediator = this;
                    consoleUtil.show("中介注册飞船" + obj.id);
                    return true;
                }
                consoleUtil.show("中介注册失败");
                return false;
            },
            send: function (msg, from, to) {
                var self = this;
                setTimeout(function () {
                    var success = Math.random() > 0.3 ? true : false;
                    if (success) {
                        consoleUtil.show("指令发送成功");
                        if (to) {//单播
                            to.receive(msg, from);
                        } else { //广播
                            if (msg.cmd == "create") {
                                self.create(msg);
                                return true;
                            }
                            for (var key in planets) {
                                if (planets[key] != from) {
                                    planets[key].signalSystem().receive(msg, from);
                                }
                            }
                        }
                    } else {
                        consoleUtil.show("指令发送失败");
                    }
                }, 1000);
            },
            destroy: function (obj) {
                if (obj instanceof  Planet) {
                    consoleUtil.show("销毁飞船No" + obj.id);
                    planets[obj.id] = undefined;
                    delete  obj;
                    return true;
                }
                consoleUtil.show("中介者移除失败");
                return false;
            },
            create: function (msg) {
                if (planets[msg.id] != undefined) {
                    consoleUtil.show("轨道" + msg.id + "上已存在飞船");
                    return false;
                }
                var planet = new Planet(msg.id);
                this.register(planet);
                annimationUtil.create(msg.id, planet.energy);
            },
            getPlanets: function () {
                return planets;
            }
        }
    }
    var annimationUtil = (function () {
        return {
            create: function (id, energy) {
                var target = ".ship_0" + id;
                $(target).css({display: "block", width: energy/2 + "px",transform: "rotate(0deg)"});
                $(target).text(energy + "%");
            },
            fly: function (id, deg, energy) {
                var target = ".ship_0" + id;
                $(target).css({transform: "rotate(" + deg + "deg)", width: energy/2 + "px"});
                $(target).text(energy + "%");
            },
            stop: function (id, energy) {
                var target = ".ship_0" + id;
                $(target).css({width: energy/2 + "px"});
                $(target).text(energy + "%");
            },
            destroy: function (id) {
                var target = ".ship_0" + id;
                $(target).css({display: "none"});
            },
            updateEnergy: function (id, energy) {
                var target = ".ship_0" + id;
                $(target).css({width: energy/2 + "px"});
                $(target).text(energy + "%");
            }
        }
    })();

    var consoleUtil = (function () {
        var show = function (msg) {
            var $console = $("#console_items");
            var $item = $("<li></li>");
            $item.text(msg);
            $console.append($item);
        };
        return {
            show: show
        };
    })();

    var Message = function (target, command) {
        this.id = target;
        this.cmd = null;
        switch (command) {
            case "create":
            case "stop":
            case "fly":
            case "destroy":
                this.cmd = command;
                break;
            default :
                alert("指令错误");
        }
    }
    var buttonHandler = function (commander) {
        var id = null;
        var cmd = null;
        $("button").on("click", function () {
            var cmdName = $(this).attr("data-type");
            switch (cmdName) {
                case "create":
                case "fly":
                case "stop":
                case "destroy" :
                    id = $(this).parent().attr("data-item");
                    cmd = cmdName;
                    break;
                default :
                    alert("指令错误");
            }
            var msg = new Message(id, cmd);
            commander.send(msg);

        })
    }

    window.onload = function () {
        var commander = new Commander();
        var mediator = new Mediator();
        mediator.register(commander);
        buttonHandler(commander);
    };

})()