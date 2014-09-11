/// <reference path="index.ts" />
/**
    Namespace for All AlienTube operations.
    @namespace AlienTube
*/
module AlienTube {
    /**
        The representation and management of an AlienTube loading screen.
        @class LoadingScreen
        @param commentSection The active CommentSection to retrieve data from.
        @param insertionPoint The DOM element in which the loading screen should be appended to as a child.
        @param [initialState] An optional initial state for the loading screen, the default is "Loading"
    */
    export class LoadingScreen {
        private representedHTMLElement : HTMLDivElement;
        private currentProgressState : LoadingState;
        private loadingAttempts : number;

        constructor(commentSection : CommentSection, initialState? : LoadingState, alternativeText? : string) {
            var loadingState = initialState || LoadingState.LOADING;
            this.representedHTMLElement = commentSection.template.getElementById("loading").content.cloneNode(true);
            this.updateProgress(loadingState, alternativeText);
        }

        get HTMLElement () {
            return this.representedHTMLElement;
        }

        public updateProgress (state : LoadingState, alternativeText? : string) {
            this.currentProgressState = state;

            switch (this.currentProgressState) {
                case LoadingState.LOADING:
                    this.loadingAttempts = 1;
                    var loadingHeader = <HTMLParagraphElement> this.representedHTMLElement.querySelector("#at_loadingheader");
                    loadingHeader.innerText = alternativeText || Main.localisationManager.get("loading");
                    break;

                case LoadingState.RETRY:
                    this.loadingAttempts++;
                    var loadingText = <HTMLParagraphElement> this.representedHTMLElement.querySelector("#at_loadingtext");
                    loadingText.innerText = Main.localisationManager.get("retryText").replace("{0}", this.loadingAttempts);
                    break;

                case LoadingState.ERROR:
                case LoadingState.COMPLETE:
                    var parentNode = this.representedHTMLElement.parentNode;
                    if (parentNode) {
                        this.representedHTMLElement.parentNode.removeChild(this.representedHTMLElement);
                    }
                    delete this;
                    break;
            }
        }
    }

    export enum LoadingState {
        LOADING,
        RETRY,
        ERROR,
        COMPLETE
    }
}