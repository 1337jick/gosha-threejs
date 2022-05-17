(window["webpackJsonp"] = window["webpackJsonp"] || []).push([["accordions"],{

/***/ "./src/js/components/vanilla/accordions.js":
/*!*************************************************!*\
  !*** ./src/js/components/vanilla/accordions.js ***!
  \*************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"default\", function() { return accordions; });\n/*** IMPORTS FROM imports-loader ***/var define=false;function accordions(element){var states={isOpen:'is-open',isHidden:'is-hidden'};var accordionsElements=Array.from(element.querySelectorAll('.js-accordion'));var accordions=accordionsElements.map(function(accordion){return{parent:accordion,header:accordion.querySelector('.js-accordion__header'),body:accordion.querySelector('.js-accordion__body__wrapper'),bodyInner:accordion.querySelector('.js-accordion__body'),open:false};});function init(){addListeners();}function addListeners(){accordions.forEach(function(accordion){accordion.header.addEventListener('click',headerClickHandler);});}function headerClickHandler(e){e.preventDefault();accordions.forEach(function(accordion){if(e.target===accordion.header){toggleAccordion(accordion);}else{closeAccordion(accordion);}});}function toggleAccordion(accordion){accordion.open?closeAccordion(accordion):showAccordion(accordion);}function showAccordion(accordion){accordion.open=true;accordion.parent.classList.add(states.isOpen);var contentHeight=accordion.bodyInner.clientHeight;accordion.body.style.maxHeight=contentHeight+'px';}function closeAccordion(accordion){accordion.open=false;accordion.parent.classList.remove(states.isOpen);accordion.body.style.maxHeight=0;}init();}//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9zcmMvanMvY29tcG9uZW50cy92YW5pbGxhL2FjY29yZGlvbnMuanM/ZDExYSJdLCJuYW1lcyI6WyJkZWZpbmUiLCJhY2NvcmRpb25zIiwiZWxlbWVudCIsInN0YXRlcyIsImlzT3BlbiIsImlzSGlkZGVuIiwiYWNjb3JkaW9uc0VsZW1lbnRzIiwiQXJyYXkiLCJmcm9tIiwicXVlcnlTZWxlY3RvckFsbCIsIm1hcCIsImFjY29yZGlvbiIsInBhcmVudCIsImhlYWRlciIsInF1ZXJ5U2VsZWN0b3IiLCJib2R5IiwiYm9keUlubmVyIiwib3BlbiIsImluaXQiLCJhZGRMaXN0ZW5lcnMiLCJmb3JFYWNoIiwiYWRkRXZlbnRMaXN0ZW5lciIsImhlYWRlckNsaWNrSGFuZGxlciIsImUiLCJwcmV2ZW50RGVmYXVsdCIsInRhcmdldCIsInRvZ2dsZUFjY29yZGlvbiIsImNsb3NlQWNjb3JkaW9uIiwic2hvd0FjY29yZGlvbiIsImNsYXNzTGlzdCIsImFkZCIsImNvbnRlbnRIZWlnaHQiLCJjbGllbnRIZWlnaHQiLCJzdHlsZSIsIm1heEhlaWdodCIsInJlbW92ZSJdLCJtYXBwaW5ncyI6IkFBQUE7QUFBQTtBQUFBLHFDQUNBLEdBQUlBLE9BQU0sQ0FBRyxLQUFiLENBRWUsUUFBU0MsV0FBVCxDQUFvQkMsT0FBcEIsQ0FBNkIsQ0FDeEMsR0FBTUMsT0FBTSxDQUFHLENBQ1hDLE1BQU0sQ0FBRSxTQURHLENBRVhDLFFBQVEsQ0FBRSxXQUZDLENBQWYsQ0FLQSxHQUFNQyxtQkFBa0IsQ0FBR0MsS0FBSyxDQUFDQyxJQUFOLENBQVdOLE9BQU8sQ0FBQ08sZ0JBQVIsQ0FBeUIsZUFBekIsQ0FBWCxDQUEzQixDQUVBLEdBQU1SLFdBQVUsQ0FBR0ssa0JBQWtCLENBQUNJLEdBQW5CLENBQXVCLFNBQUNDLFNBQUQsQ0FBZSxDQUNyRCxNQUFPLENBQ0hDLE1BQU0sQ0FBRUQsU0FETCxDQUVIRSxNQUFNLENBQUVGLFNBQVMsQ0FBQ0csYUFBVixDQUF3Qix1QkFBeEIsQ0FGTCxDQUdIQyxJQUFJLENBQUVKLFNBQVMsQ0FBQ0csYUFBVixDQUF3Qiw4QkFBeEIsQ0FISCxDQUlIRSxTQUFTLENBQUVMLFNBQVMsQ0FBQ0csYUFBVixDQUF3QixxQkFBeEIsQ0FKUixDQUtIRyxJQUFJLENBQUUsS0FMSCxDQUFQLENBT0gsQ0FSa0IsQ0FBbkIsQ0FVQSxRQUFTQyxLQUFULEVBQWdCLENBQ1pDLFlBQVksR0FDZixDQUVELFFBQVNBLGFBQVQsRUFBd0IsQ0FDcEJsQixVQUFVLENBQUNtQixPQUFYLENBQW1CLFNBQUNULFNBQUQsQ0FBZSxDQUM5QkEsU0FBUyxDQUFDRSxNQUFWLENBQWlCUSxnQkFBakIsQ0FBa0MsT0FBbEMsQ0FBMkNDLGtCQUEzQyxFQUNILENBRkQsRUFHSCxDQUVELFFBQVNBLG1CQUFULENBQTRCQyxDQUE1QixDQUErQixDQUMzQkEsQ0FBQyxDQUFDQyxjQUFGLEdBQ0F2QixVQUFVLENBQUNtQixPQUFYLENBQW1CLFNBQUNULFNBQUQsQ0FBZSxDQUM5QixHQUFJWSxDQUFDLENBQUNFLE1BQUYsR0FBYWQsU0FBUyxDQUFDRSxNQUEzQixDQUFtQyxDQUMvQmEsZUFBZSxDQUFDZixTQUFELENBQWYsQ0FDSCxDQUZELElBRU8sQ0FDSGdCLGNBQWMsQ0FBQ2hCLFNBQUQsQ0FBZCxDQUNILENBQ0osQ0FORCxFQU9ILENBRUQsUUFBU2UsZ0JBQVQsQ0FBeUJmLFNBQXpCLENBQW9DLENBQ2hDQSxTQUFTLENBQUNNLElBQVYsQ0FBaUJVLGNBQWMsQ0FBQ2hCLFNBQUQsQ0FBL0IsQ0FBNkNpQixhQUFhLENBQUNqQixTQUFELENBQTFELENBQ0gsQ0FFRCxRQUFTaUIsY0FBVCxDQUF1QmpCLFNBQXZCLENBQWtDLENBQzlCQSxTQUFTLENBQUNNLElBQVYsQ0FBaUIsSUFBakIsQ0FDQU4sU0FBUyxDQUFDQyxNQUFWLENBQWlCaUIsU0FBakIsQ0FBMkJDLEdBQTNCLENBQStCM0IsTUFBTSxDQUFDQyxNQUF0QyxFQUNBLEdBQU0yQixjQUFhLENBQUdwQixTQUFTLENBQUNLLFNBQVYsQ0FBb0JnQixZQUExQyxDQUNBckIsU0FBUyxDQUFDSSxJQUFWLENBQWVrQixLQUFmLENBQXFCQyxTQUFyQixDQUFpQ0gsYUFBYSxDQUFHLElBQWpELENBQ0gsQ0FFRCxRQUFTSixlQUFULENBQXdCaEIsU0FBeEIsQ0FBbUMsQ0FDL0JBLFNBQVMsQ0FBQ00sSUFBVixDQUFpQixLQUFqQixDQUNBTixTQUFTLENBQUNDLE1BQVYsQ0FBaUJpQixTQUFqQixDQUEyQk0sTUFBM0IsQ0FBa0NoQyxNQUFNLENBQUNDLE1BQXpDLEVBQ0FPLFNBQVMsQ0FBQ0ksSUFBVixDQUFla0IsS0FBZixDQUFxQkMsU0FBckIsQ0FBaUMsQ0FBakMsQ0FDSCxDQUVEaEIsSUFBSSxHQUNQIiwiZmlsZSI6Ii4vc3JjL2pzL2NvbXBvbmVudHMvdmFuaWxsYS9hY2NvcmRpb25zLmpzLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyoqKiBJTVBPUlRTIEZST00gaW1wb3J0cy1sb2FkZXIgKioqL1xudmFyIGRlZmluZSA9IGZhbHNlO1xuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBhY2NvcmRpb25zKGVsZW1lbnQpIHtcbiAgICBjb25zdCBzdGF0ZXMgPSB7XG4gICAgICAgIGlzT3BlbjogJ2lzLW9wZW4nLFxuICAgICAgICBpc0hpZGRlbjogJ2lzLWhpZGRlbicsXG4gICAgfTtcblxuICAgIGNvbnN0IGFjY29yZGlvbnNFbGVtZW50cyA9IEFycmF5LmZyb20oZWxlbWVudC5xdWVyeVNlbGVjdG9yQWxsKCcuanMtYWNjb3JkaW9uJykpO1xuXG4gICAgY29uc3QgYWNjb3JkaW9ucyA9IGFjY29yZGlvbnNFbGVtZW50cy5tYXAoKGFjY29yZGlvbikgPT4ge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgcGFyZW50OiBhY2NvcmRpb24sXG4gICAgICAgICAgICBoZWFkZXI6IGFjY29yZGlvbi5xdWVyeVNlbGVjdG9yKCcuanMtYWNjb3JkaW9uX19oZWFkZXInKSxcbiAgICAgICAgICAgIGJvZHk6IGFjY29yZGlvbi5xdWVyeVNlbGVjdG9yKCcuanMtYWNjb3JkaW9uX19ib2R5X193cmFwcGVyJyksXG4gICAgICAgICAgICBib2R5SW5uZXI6IGFjY29yZGlvbi5xdWVyeVNlbGVjdG9yKCcuanMtYWNjb3JkaW9uX19ib2R5JyksXG4gICAgICAgICAgICBvcGVuOiBmYWxzZSxcbiAgICAgICAgfTtcbiAgICB9KTtcblxuICAgIGZ1bmN0aW9uIGluaXQoKSB7XG4gICAgICAgIGFkZExpc3RlbmVycygpO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGFkZExpc3RlbmVycygpIHtcbiAgICAgICAgYWNjb3JkaW9ucy5mb3JFYWNoKChhY2NvcmRpb24pID0+IHtcbiAgICAgICAgICAgIGFjY29yZGlvbi5oZWFkZXIuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBoZWFkZXJDbGlja0hhbmRsZXIpO1xuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBoZWFkZXJDbGlja0hhbmRsZXIoZSkge1xuICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgIGFjY29yZGlvbnMuZm9yRWFjaCgoYWNjb3JkaW9uKSA9PiB7XG4gICAgICAgICAgICBpZiAoZS50YXJnZXQgPT09IGFjY29yZGlvbi5oZWFkZXIpIHtcbiAgICAgICAgICAgICAgICB0b2dnbGVBY2NvcmRpb24oYWNjb3JkaW9uKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgY2xvc2VBY2NvcmRpb24oYWNjb3JkaW9uKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gdG9nZ2xlQWNjb3JkaW9uKGFjY29yZGlvbikge1xuICAgICAgICBhY2NvcmRpb24ub3BlbiA/IGNsb3NlQWNjb3JkaW9uKGFjY29yZGlvbikgOiBzaG93QWNjb3JkaW9uKGFjY29yZGlvbik7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gc2hvd0FjY29yZGlvbihhY2NvcmRpb24pIHtcbiAgICAgICAgYWNjb3JkaW9uLm9wZW4gPSB0cnVlO1xuICAgICAgICBhY2NvcmRpb24ucGFyZW50LmNsYXNzTGlzdC5hZGQoc3RhdGVzLmlzT3Blbik7XG4gICAgICAgIGNvbnN0IGNvbnRlbnRIZWlnaHQgPSBhY2NvcmRpb24uYm9keUlubmVyLmNsaWVudEhlaWdodDtcbiAgICAgICAgYWNjb3JkaW9uLmJvZHkuc3R5bGUubWF4SGVpZ2h0ID0gY29udGVudEhlaWdodCArICdweCc7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gY2xvc2VBY2NvcmRpb24oYWNjb3JkaW9uKSB7XG4gICAgICAgIGFjY29yZGlvbi5vcGVuID0gZmFsc2U7XG4gICAgICAgIGFjY29yZGlvbi5wYXJlbnQuY2xhc3NMaXN0LnJlbW92ZShzdGF0ZXMuaXNPcGVuKTtcbiAgICAgICAgYWNjb3JkaW9uLmJvZHkuc3R5bGUubWF4SGVpZ2h0ID0gMDtcbiAgICB9XG5cbiAgICBpbml0KCk7XG59XG5cbiJdLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///./src/js/components/vanilla/accordions.js\n");

/***/ })

}]);