
export default class ToolbarController {
    constructor(authentication) {
        'ngInject';

        this.logout = () => {
            authentication.logout();
        }

    }
}
