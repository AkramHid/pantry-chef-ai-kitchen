
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Calendar } from '@/components/ui/calendar';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  MapPin, 
  Calendar as CalendarIcon, 
  Clock, 
  Users, 
  DollarSign, 
  ChefHat, 
  Search,
  Star,
  ArrowLeft,
  Check,
  CreditCard
} from 'lucide-react';
import { Chef } from '@/types/chef';
import { useToast } from '@/hooks/use-toast';

interface UberStyleBookingProps {
  isOpen: boolean;
  onClose: () => void;
  selectedChef?: Chef | null;
}

type BookingStep = 'search' | 'chef-selection' | 'details' | 'timing' | 'payment' | 'confirmation';

const UberStyleBooking: React.FC<UberStyleBookingProps> = ({ isOpen, onClose, selectedChef }) => {
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState<BookingStep>('search');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedChefState, setSelectedChefState] = useState<Chef | null>(selectedChef || null);
  const [bookingDetails, setBookingDetails] = useState({
    location: '',
    date: undefined as Date | undefined,
    time: '',
    guests: 2,
    specialRequests: '',
    mealType: '',
    duration: 2
  });

  useEffect(() => {
    if (selectedChef) {
      setSelectedChefState(selectedChef);
      setCurrentStep('details');
    } else {
      setCurrentStep('search');
    }
  }, [selectedChef]);

  const mockChefs = [
    {
      id: '1',
      name: 'Sarah Johnson',
      rating: 4.9,
      hourlyRate: 85,
      image: 'https://images.unsplash.com/photo-1556911073-38141963c9e0?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
      specialties: ['Italian', 'French'],
      distance: '2.3 km away'
    },
    {
      id: '2', 
      name: 'Michael Chen',
      rating: 4.8,
      hourlyRate: 95,
      image: 'https://images.unsplash.com/photo-1583394838336-acd977736f90?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
      specialties: ['Asian', 'Fusion'],
      distance: '3.1 km away'
    }
  ];

  const timeSlots = [
    '11:00 AM', '11:30 AM', '12:00 PM', '12:30 PM',
    '1:00 PM', '1:30 PM', '2:00 PM', '2:30 PM',
    '6:00 PM', '6:30 PM', '7:00 PM', '7:30 PM'
  ];

  const handleNext = () => {
    const steps: BookingStep[] = ['search', 'chef-selection', 'details', 'timing', 'payment', 'confirmation'];
    const currentIndex = steps.indexOf(currentStep);
    if (currentIndex < steps.length - 1) {
      setCurrentStep(steps[currentIndex + 1]);
    }
  };

  const handleBack = () => {
    const steps: BookingStep[] = ['search', 'chef-selection', 'details', 'timing', 'payment', 'confirmation'];
    const currentIndex = steps.indexOf(currentStep);
    if (currentIndex > 0) {
      setCurrentStep(steps[currentIndex - 1]);
    }
  };

  const handleBookingComplete = () => {
    toast({
      title: 'Booking Confirmed!',
      description: `Your chef ${selectedChefState?.name} has been booked successfully.`,
    });
    onClose();
  };

  const getStepProgress = () => {
    const steps = ['search', 'chef-selection', 'details', 'timing', 'payment', 'confirmation'];
    return ((steps.indexOf(currentStep) + 1) / steps.length) * 100;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-end md:items-center justify-center">
      <motion.div
        initial={{ y: '100%', opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: '100%', opacity: 0 }}
        className="bg-white w-full md:max-w-md md:mx-4 md:rounded-2xl overflow-hidden shadow-xl"
        style={{ maxHeight: '90vh' }}
      >
        {/* Header */}
        <div className="bg-kitchen-green text-white p-4">
          <div className="flex items-center justify-between mb-3">
            <Button
              variant="ghost"
              size="icon"
              onClick={currentStep === 'search' ? onClose : handleBack}
              className="text-white hover:bg-white/20"
            >
              <ArrowLeft size={20} />
            </Button>
            <h2 className="text-lg font-semibold">Book a Chef</h2>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="text-white hover:bg-white/20"
            >
              ×
            </Button>
          </div>
          {/* Progress Bar */}
          <div className="w-full bg-white/20 rounded-full h-1">
            <div 
              className="bg-white h-1 rounded-full transition-all duration-300"
              style={{ width: `${getStepProgress()}%` }}
            />
          </div>
        </div>

        {/* Content */}
        <div className="overflow-y-auto" style={{ maxHeight: 'calc(90vh - 120px)' }}>
          <AnimatePresence mode="wait">
            {/* Search Step */}
            {currentStep === 'search' && (
              <motion.div
                key="search"
                initial={{ x: 20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: -20, opacity: 0 }}
                className="p-6 space-y-4"
              >
                <div>
                  <h3 className="text-xl font-bold mb-2">Where do you need a chef?</h3>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                    <Input
                      placeholder="Enter your address"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10 py-3 text-lg"
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <button className="w-full p-3 text-left border rounded-lg hover:bg-gray-50 flex items-center">
                    <MapPin className="h-5 w-5 text-gray-400 mr-3" />
                    <div>
                      <p className="font-medium">Use current location</p>
                      <p className="text-sm text-gray-600">Enable location services</p>
                    </div>
                  </button>
                </div>

                <Button 
                  onClick={handleNext}
                  disabled={!searchQuery}
                  className="w-full py-3 bg-kitchen-green hover:bg-kitchen-green/90"
                >
                  Find Chefs Nearby
                </Button>
              </motion.div>
            )}

            {/* Chef Selection Step */}
            {currentStep === 'chef-selection' && (
              <motion.div
                key="chef-selection"
                initial={{ x: 20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: -20, opacity: 0 }}
                className="p-6 space-y-4"
              >
                <h3 className="text-xl font-bold">Choose your chef</h3>
                <div className="space-y-3">
                  {mockChefs.map((chef) => (
                    <Card 
                      key={chef.id}
                      className={`cursor-pointer transition-all hover:shadow-md ${
                        selectedChefState?.id === chef.id ? 'ring-2 ring-kitchen-green' : ''
                      }`}
                      onClick={() => setSelectedChefState(chef as any)}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-center space-x-3">
                          <img 
                            src={chef.image} 
                            alt={chef.name}
                            className="w-16 h-16 rounded-full object-cover"
                          />
                          <div className="flex-1">
                            <div className="flex items-center justify-between">
                              <h4 className="font-semibold">{chef.name}</h4>
                              <div className="flex items-center">
                                <Star className="h-4 w-4 text-yellow-500 mr-1" />
                                <span className="text-sm">{chef.rating}</span>
                              </div>
                            </div>
                            <p className="text-sm text-gray-600">{chef.specialties.join(', ')}</p>
                            <div className="flex items-center justify-between mt-2">
                              <span className="text-sm text-gray-500">{chef.distance}</span>
                              <span className="font-semibold">${chef.hourlyRate}/hr</span>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
                <Button 
                  onClick={handleNext}
                  disabled={!selectedChefState}
                  className="w-full py-3 bg-kitchen-green hover:bg-kitchen-green/90"
                >
                  Continue with {selectedChefState?.name}
                </Button>
              </motion.div>
            )}

            {/* Booking Details Step */}
            {currentStep === 'details' && (
              <motion.div
                key="details"
                initial={{ x: 20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: -20, opacity: 0 }}
                className="p-6 space-y-4"
              >
                <h3 className="text-xl font-bold">Booking details</h3>
                
                <div className="space-y-3">
                  <div>
                    <Label>Number of guests</Label>
                    <Select
                      value={bookingDetails.guests.toString()}
                      onValueChange={(value) => setBookingDetails(prev => ({ ...prev, guests: parseInt(value) }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {[1,2,3,4,5,6,7,8,9,10].map(num => (
                          <SelectItem key={num} value={num.toString()}>
                            {num} {num === 1 ? 'guest' : 'guests'}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label>Meal type</Label>
                    <Select
                      value={bookingDetails.mealType}
                      onValueChange={(value) => setBookingDetails(prev => ({ ...prev, mealType: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select meal type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="breakfast">Breakfast</SelectItem>
                        <SelectItem value="brunch">Brunch</SelectItem>
                        <SelectItem value="lunch">Lunch</SelectItem>
                        <SelectItem value="dinner">Dinner</SelectItem>
                        <SelectItem value="cocktail">Cocktail Party</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label>Duration (hours)</Label>
                    <Select
                      value={bookingDetails.duration.toString()}
                      onValueChange={(value) => setBookingDetails(prev => ({ ...prev, duration: parseInt(value) }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {[1,2,3,4,5,6].map(hours => (
                          <SelectItem key={hours} value={hours.toString()}>
                            {hours} {hours === 1 ? 'hour' : 'hours'}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label>Special requests</Label>
                    <Textarea
                      value={bookingDetails.specialRequests}
                      onChange={(e) => setBookingDetails(prev => ({ ...prev, specialRequests: e.target.value }))}
                      placeholder="Dietary restrictions, preferences, etc."
                      rows={3}
                    />
                  </div>
                </div>

                <Button 
                  onClick={handleNext}
                  className="w-full py-3 bg-kitchen-green hover:bg-kitchen-green/90"
                >
                  Choose Date & Time
                </Button>
              </motion.div>
            )}

            {/* Timing Step */}
            {currentStep === 'timing' && (
              <motion.div
                key="timing"
                initial={{ x: 20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: -20, opacity: 0 }}
                className="p-6 space-y-4"
              >
                <h3 className="text-xl font-bold">When do you need the chef?</h3>
                
                <div>
                  <Label className="mb-2 block">Select date</Label>
                  <Calendar
                    mode="single"
                    selected={bookingDetails.date}
                    onSelect={(date) => setBookingDetails(prev => ({ ...prev, date }))}
                    disabled={(date) => date < new Date()}
                    className="rounded-md border"
                  />
                </div>

                <div>
                  <Label className="mb-2 block">Select time</Label>
                  <div className="grid grid-cols-2 gap-2">
                    {timeSlots.map((time) => (
                      <Button
                        key={time}
                        variant={bookingDetails.time === time ? "default" : "outline"}
                        onClick={() => setBookingDetails(prev => ({ ...prev, time }))}
                        className="text-sm"
                      >
                        {time}
                      </Button>
                    ))}
                  </div>
                </div>

                <Button 
                  onClick={handleNext}
                  disabled={!bookingDetails.date || !bookingDetails.time}
                  className="w-full py-3 bg-kitchen-green hover:bg-kitchen-green/90"
                >
                  Continue to Payment
                </Button>
              </motion.div>
            )}

            {/* Payment Step */}
            {currentStep === 'payment' && (
              <motion.div
                key="payment"
                initial={{ x: 20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: -20, opacity: 0 }}
                className="p-6 space-y-4"
              >
                <h3 className="text-xl font-bold">Payment details</h3>
                
                {/* Booking Summary */}
                <Card className="bg-gray-50">
                  <CardContent className="p-4 space-y-2">
                    <div className="flex justify-between">
                      <span>Chef service ({bookingDetails.duration}h)</span>
                      <span>${(selectedChefState?.hourlyRate || 85) * bookingDetails.duration}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Service fee</span>
                      <span>$15</span>
                    </div>
                    <div className="border-t pt-2 flex justify-between font-semibold">
                      <span>Total</span>
                      <span>${((selectedChefState?.hourlyRate || 85) * bookingDetails.duration) + 15}</span>
                    </div>
                  </CardContent>
                </Card>

                <div className="space-y-3">
                  <Button
                    variant="outline"
                    className="w-full justify-start p-4 h-auto"
                  >
                    <CreditCard className="h-5 w-5 mr-3" />
                    <div className="text-left">
                      <p className="font-medium">Credit Card</p>
                      <p className="text-sm text-gray-600">**** **** **** 1234</p>
                    </div>
                  </Button>
                </div>

                <Button 
                  onClick={handleNext}
                  className="w-full py-3 bg-kitchen-green hover:bg-kitchen-green/90"
                >
                  Complete Booking
                </Button>
              </motion.div>
            )}

            {/* Confirmation Step */}
            {currentStep === 'confirmation' && (
              <motion.div
                key="confirmation"
                initial={{ x: 20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: -20, opacity: 0 }}
                className="p-6 space-y-6 text-center"
              >
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                  <Check className="h-8 w-8 text-green-600" />
                </div>
                
                <div>
                  <h3 className="text-xl font-bold mb-2">Booking Confirmed!</h3>
                  <p className="text-gray-600">Your chef will arrive on time and ready to cook</p>
                </div>

                <Card>
                  <CardContent className="p-4 space-y-2 text-left">
                    <div className="flex items-center space-x-3 mb-3">
                      <img 
                        src={selectedChefState?.image} 
                        alt={selectedChefState?.name}
                        className="w-12 h-12 rounded-full object-cover"
                      />
                      <div>
                        <h4 className="font-semibold">{selectedChefState?.name}</h4>
                        <div className="flex items-center">
                          <Star className="h-4 w-4 text-yellow-500 mr-1" />
                          <span className="text-sm">{selectedChefState?.rating}</span>
                        </div>
                      </div>
                    </div>
                    <div className="space-y-1 text-sm">
                      <div className="flex justify-between">
                        <span>Date:</span>
                        <span>{bookingDetails.date?.toLocaleDateString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Time:</span>
                        <span>{bookingDetails.time}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Guests:</span>
                        <span>{bookingDetails.guests}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Duration:</span>
                        <span>{bookingDetails.duration} hours</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Button 
                  onClick={handleBookingComplete}
                  className="w-full py-3 bg-kitchen-green hover:bg-kitchen-green/90"
                >
                  Done
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
};

export default UberStyleBooking;
