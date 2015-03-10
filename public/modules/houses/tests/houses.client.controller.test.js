'use strict';

(function() {
	// Houses Controller Spec
	describe('Houses Controller Tests', function() {
		// Initialize global variables
		var HousesController,
		scope,
		$httpBackend,
		$stateParams,
		$location;

		// The $resource service augments the response object with methods for updating and deleting the resource.
		// If we were to use the standard toEqual matcher, our tests would fail because the test values would not match
		// the responses exactly. To solve the problem, we define a new toEqualData Jasmine matcher.
		// When the toEqualData matcher compares two objects, it takes only object properties into
		// account and ignores methods.
		beforeEach(function() {
			jasmine.addMatchers({
				toEqualData: function(util, customEqualityTesters) {
					return {
						compare: function(actual, expected) {
							return {
								pass: angular.equals(actual, expected)
							};
						}
					};
				}
			});
		});

		// Then we can start by loading the main application module
		beforeEach(module(ApplicationConfiguration.applicationModuleName));

		// The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
		// This allows us to inject a service but then attach it to a variable
		// with the same name as the service.
		beforeEach(inject(function($controller, $rootScope, _$location_, _$stateParams_, _$httpBackend_) {
			// Set a new global scope
			scope = $rootScope.$new();

			// Point global variables to injected services
			$stateParams = _$stateParams_;
			$httpBackend = _$httpBackend_;
			$location = _$location_;

			// Initialize the Houses controller.
			HousesController = $controller('HousesController', {
				$scope: scope
			});
		}));

		it('$scope.find() should create an array with at least one House object fetched from XHR', inject(function(Houses) {
			// Create sample House using the Houses service
			var sampleHouse = new Houses({
				name: 'New House'
			});

			// Create a sample Houses array that includes the new House
			var sampleHouses = [sampleHouse];

			// Set GET response
			$httpBackend.expectGET('houses').respond(sampleHouses);

			// Run controller functionality
			scope.find();
			$httpBackend.flush();

			// Test scope value
			expect(scope.houses).toEqualData(sampleHouses);
		}));

		it('$scope.findOne() should create an array with one House object fetched from XHR using a houseId URL parameter', inject(function(Houses) {
			// Define a sample House object
			var sampleHouse = new Houses({
				name: 'New House'
			});

			// Set the URL parameter
			$stateParams.houseId = '525a8422f6d0f87f0e407a33';

			// Set GET response
			$httpBackend.expectGET(/houses\/([0-9a-fA-F]{24})$/).respond(sampleHouse);

			// Run controller functionality
			scope.findOne();
			$httpBackend.flush();

			// Test scope value
			expect(scope.house).toEqualData(sampleHouse);
		}));

		it('$scope.create() with valid form data should send a POST request with the form input values and then locate to new object URL', inject(function(Houses) {
			// Create a sample House object
			var sampleHousePostData = new Houses({
				name: 'New House'
			});

			// Create a sample House response
			var sampleHouseResponse = new Houses({
				_id: '525cf20451979dea2c000001',
				name: 'New House'
			});

			// Fixture mock form input values
			scope.name = 'New House';

			// Set POST response
			$httpBackend.expectPOST('houses', sampleHousePostData).respond(sampleHouseResponse);

			// Run controller functionality
			scope.create();
			$httpBackend.flush();

			// Test form inputs are reset
			expect(scope.name).toEqual('');

			// Test URL redirection after the House was created
			expect($location.path()).toBe('/houses/' + sampleHouseResponse._id);
		}));

		it('$scope.update() should update a valid House', inject(function(Houses) {
			// Define a sample House put data
			var sampleHousePutData = new Houses({
				_id: '525cf20451979dea2c000001',
				name: 'New House'
			});

			// Mock House in scope
			scope.house = sampleHousePutData;

			// Set PUT response
			$httpBackend.expectPUT(/houses\/([0-9a-fA-F]{24})$/).respond();

			// Run controller functionality
			scope.update();
			$httpBackend.flush();

			// Test URL location to new object
			expect($location.path()).toBe('/houses/' + sampleHousePutData._id);
		}));

		it('$scope.remove() should send a DELETE request with a valid houseId and remove the House from the scope', inject(function(Houses) {
			// Create new House object
			var sampleHouse = new Houses({
				_id: '525a8422f6d0f87f0e407a33'
			});

			// Create new Houses array and include the House
			scope.houses = [sampleHouse];

			// Set expected DELETE response
			$httpBackend.expectDELETE(/houses\/([0-9a-fA-F]{24})$/).respond(204);

			// Run controller functionality
			scope.remove(sampleHouse);
			$httpBackend.flush();

			// Test array after successful delete
			expect(scope.houses.length).toBe(0);
		}));
	});
}());