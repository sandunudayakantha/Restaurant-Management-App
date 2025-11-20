import mongoose, { Document, Schema } from 'mongoose';

export interface IRestaurantProfile extends Document {
  name: string;
  address: string;
  logo_url?: string;
  default_currency: string;
  contact: {
    phone?: string;
    email?: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

const RestaurantProfileSchema = new Schema<IRestaurantProfile>(
  {
    name: {
      type: String,
      required: [true, 'Restaurant name is required'],
      trim: true,
    },
    address: {
      type: String,
      required: [true, 'Address is required'],
      trim: true,
    },
    logo_url: {
      type: String,
    },
    default_currency: {
      type: String,
      default: 'USD',
      trim: true,
    },
    contact: {
      phone: {
        type: String,
        trim: true,
      },
      email: {
        type: String,
        trim: true,
        lowercase: true,
      },
    },
  },
  {
    timestamps: true,
  }
);

// Ensure only one restaurant profile exists
RestaurantProfileSchema.statics.getProfile = async function () {
  let profile = await this.findOne();
  if (!profile) {
    profile = await this.create({
      name: 'My Restaurant',
      address: '123 Main Street, City, Country',
      default_currency: 'USD',
      contact: {
        phone: '',
        email: '',
      },
    });
  }
  return profile;
};

export const RestaurantProfile = mongoose.model<IRestaurantProfile>(
  'RestaurantProfile',
  RestaurantProfileSchema
);

