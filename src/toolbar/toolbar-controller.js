(function() {
    'use strict';

    class ToolbarCtrl {
        constructor($timeout, currentWindowService) {
            this.$timeout = $timeout;
            this.currentWindowService = currentWindowService;
            this.store = null;
            this.window = null;
            this.maximised = false;
            this.compact = false;
            currentWindowService.ready(this.onReady.bind(this));
        }

        onReady() {
            if (!this.store && window.storeService) {
                this.store = window.storeService.open(window.name);
            }

            this.compact = this.store && this.store.isCompact();
            this.window = this.currentWindowService.getCurrentWindow();
            this.window.addEventListener('maximized', () => {
                this.$timeout(() => {
                    this.maximised = true;
                });
            });

            this.window.addEventListener('restored', () => {
                this.$timeout(() => {
                    this.maximised = false;
                });
            });
        }

        minimiseClick() {
            this.window.minimize();
        }

        maximiseClick() {
            this.window.maximize();
        }

        normalSizeClick() {
            this.window.restore();
            this.window.resizeTo(1280, 720, 'top-right');
        }

        compactClick() {
            if (!this.store) {
                this.store = window.storeService.open(window.name);
            }

            this.compact = !this.compact;
            this.store.toggleCompact(this.compact);
            window.windowService.updateOptions(this.window, this.compact);

            if (this.compact) {
                this.window.resizeTo(230, 500, 'top-right');
            }
            else if (this.maximised) {
                this.window.maximize();
            }
            else {
                this.window.resizeTo(1280, 720, 'top-right');
            }
        }

        closeClick() {
            this.window.close();
        }
    }
    ToolbarCtrl.$inject = ['$timeout', 'currentWindowService'];

    angular.module('openfin.toolbar')
        .controller('ToolbarCtrl', ToolbarCtrl);
}());
