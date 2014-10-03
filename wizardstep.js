/* ========================================================================
 * Bootstrap Wizard Step v1.0
 * http://johnitvn.github.io/bootstrap-wizard-step
 * ========================================================================
 * Copyright John Martin
 * Licensed under Apache License 2.0 (https://github.com/johnitvn/bootstrap-wizard-step/blob/master/LICENSE)
 * ======================================================================== */
$.fn.boostrapWizardStep = function(options) {

    var defaults = {
        startStep: 0,
        onNextStep: null,
        onBackStep: null,
        onJumpBack: null,
        tabIdentifier: "#wizard-tab",
        contentIdentifier: "#wizard-content",
        btnNextIdentifier: "#next",
        btnPreviousIdentifier: "#previous"
    };

    var settings, tab, content, next, previous, current, tabSteps, old;

    function prepareConfig(rootElm) {
        var markup = {};
        if (typeof $(rootElm).attr("data-start") !== typeof undefined) {
            markup['startStep'] = parseInt($(rootElm).attr("data-start"));
        }
        if (typeof $(rootElm).attr("data-content") !== typeof undefined) {
            markup['contentIdentifier'] = $(rootElm).attr("data-content");
        }
        if (typeof $(rootElm).attr("data-tab") !== typeof undefined) {
            markup['tabIdentifier'] = $(rootElm).attr("data-tab");
        }
        if (typeof $(rootElm).attr("data-previous") !== typeof undefined) {
            markup['btnPreviousIdentifier'] = $(rootElm).attr("data-previous");
        }
        if (typeof $(rootElm).attr("data-next") !== typeof undefined) {
            markup['btnNextIdentifier'] = $(rootElm).attr("data-next");
        }
        settings = $.extend({}, defaults, markup, options);
        tab = $(rootElm).find(settings.tabIdentifier);
        content = $(rootElm).find(settings.contentIdentifier);
        next = $(rootElm).find(settings.btnNextIdentifier);
        previous = $(rootElm).find(settings.btnPreviousIdentifier);
        current = settings.startStep;
        tabSteps = $(tab).find("li>a");
    }

    function startStep(index) {
        old = current;
        current = index;
        refreshTab();
        refreshButtons();
    }

    function refreshButtons() {
        if (current === 0) {
            $(previous).addClass("disabled");
        } else {
            $(previous).removeClass("disabled");
        }
    }

    function refreshTab() {

        /**
         * Disable and set inactive for all finised step
         */
        for (var i = 0; i < current; i++) {
            $(tabSteps[i]).parent().removeClass("disabled active fade");
            $(tabSteps[i]).parent().removeClass("active");
            $(tabSteps[i]).parent().removeClass("fade");
            $(content).find($(tabSteps[i]).attr("href")).removeClass("active");
        }
        /*
         * enable current step
         */
        $(tabSteps[current]).parent().removeClass("disabled");
        $(tabSteps[current]).parent().removeClass("fade");
        $(tabSteps[current]).parent().addClass("active");
        $(content).find($(tabSteps[current]).attr("href")).addClass("active");
        
        /**
         * Disable all next step
         */
        for (var i = current + 1; i < tabSteps.length; i++) {
            $(tabSteps[i]).parent().addClass("disabled");
            $(tabSteps[i]).parent().removeClass("active");
            $(tabSteps[i]).parent().removeClass("fade");
            $(content).find($(tabSteps[i]).attr("href")).removeClass("active");
        }

    }

    return this.each(function() {
        var rootElm = $(this);

        /**
         * Don't do anything if exist wiward
         */
        if ($(this).hasClass("in-wizard")) {
            return false;
        } else {
            $(this).addClass("in-wizard");
        }
        prepareConfig(rootElm);
        /**
         * Disable user click to tab
         */
        $(tab).on("click", "li>a", function(e) {
            var index = $(this).parent().index();
            if (index >= current) {
                return;
            }

            /**
             * Notify even wizard.jumpback with index of step jump to
             */
            var event = jQuery.Event("jumpback.bs.wizard");
            $(rootElm).trigger(event, [index, current]);
            if (event.isDefaultPrevented() === false && (settings.onJumpBack === null || (settings.onJumpBack !== null && settings.onJumpBack(index, current)))) {
                startStep(index);
            }
            e.preventDefault();
        });

        /**
         * The first open the first step
         */
        startStep(settings.startStep);

        $(next).click(function(e) {
            /**
             * skip if the end of wizard
             */
            if (current === tabSteps.length - 1) {
                return;
            }
            /**
             * Notify even wizard.next with evendata index is current of step
             */
            var event = jQuery.Event("next.bs.wizard");
            $(rootElm).trigger(event, [current]);
            if (event.isDefaultPrevented() === false && (settings.onNextStep === null || (settings.onNextStep !== null && settings.onNextStep(current)))) {
                startStep(current + 1);
            }
            e.preventDefault();
        });

        $(previous).click(function(e) {
            /**
             * skip if the end of wizard
             */
            if (current === 0) {
                return;
            }
            /**
             * Notify even wizard.next with evendata index is current of step
             */
            var event = jQuery.Event("previous.bs.wizard");
            $(rootElm).trigger(event, [current]);
            if (event.isDefaultPrevented() === false && (settings.onBackStep === null || (settings.onBackStep !== null && settings.onBackStep(current)))) {
                startStep(current - 1);
            }
            e.preventDefault();
        });


    });

};
$(function() {
    $('[data-toggle="bootstrap-wizard-step"]').boostrapWizardStep();
});
