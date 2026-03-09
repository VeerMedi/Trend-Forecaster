/**
 * Indian Fashion Brand Database
 * Comprehensive list of Indian fashion brands across segments
 */

export interface IndianBrand {
    name: string;
    category: 'Luxury' | 'Premium' | 'Mass Market' | 'Fast Fashion' | 'Ethnic' | 'Sustainable';
    specialization: string[];
    priceRange: string;
    regions: string[];  // Where they're popular
    founded: number;
    notableFor: string;
}

export const INDIAN_BRANDS: IndianBrand[] = [
    // Luxury & Designer
    {
        name: 'Sabyasachi',
        category: 'Luxury',
        specialization: ['Bridal', 'Ethnic Couture', 'Jewelry'],
        priceRange: '₹50,000 - ₹10,00,000+',
        regions: ['Pan-India', 'International'],
        founded: 1999,
        notableFor: 'Celebrity bridal wear, traditional craftsmanship revitalization'
    },
    {
        name: 'Manish Malhotra',
        category: 'Luxury',
        specialization: ['Bridal', 'Evening Wear', 'Bollywood Fashion'],
        priceRange: '₹40,000 - ₹8,00,000+',
        regions: ['Pan-India', 'International'],
        founded: 2005,
        notableFor: 'Bollywood styling, fusion ethnic wear'
    },
    {
        name: 'Anita Dongre',
        category: 'Premium',
        specialization: ['Bridal', 'Sustainable', 'Fusion Wear'],
        priceRange: '₹15,000 - ₹3,00,000',
        regions: ['Pan-India'],
        founded: 1995,
        notableFor: 'Sustainable luxury, grassroots artisan support'
    },
    {
        name: 'Tarun Tahiliani',
        category: 'Luxury',
        specialization: ['Bridal', 'Menswear', 'Contemporary Indian'],
        priceRange: '₹30,000 - ₹6,00,000',
        regions: ['Delhi', 'Mumbai', 'Bangalore'],
        founded: 1990,
        notableFor: 'Draping innovation, modern Indian silhouettes'
    },

    // Premium Contemporary
    {
        name: 'FabIndia',
        category: 'Premium',
        specialization: ['Ethnic', 'Handloom', 'Sustainable'],
        priceRange: '₹1,000 - ₹15,000',
        regions: ['Pan-India', '250+ stores'],
        founded: 1960,
        notableFor: 'Handloom revival, artisan empowerment'
    },
    {
        name: 'Good Earth',
        category: 'Premium',
        specialization: ['Ethnic', 'Home Decor', 'Luxury Lifestyle'],
        priceRange: '₹5,000 - ₹50,000',
        regions: ['Metro cities'],
        founded: 1996,
        notableFor: 'Luxury Indian aesthetic, craftsmanship'
    },
    {
        name: 'Raw Mango',
        category: 'Premium',
        specialization: ['Sarees', 'Textile Innovation'],
        priceRange: '₹8,000 - ₹80,000',
        regions: ['Delhi', 'Mumbai', 'Online'],
        founded: 2008,
        notableFor: 'Contemporary saree designs, textile heritage'
    },

    // Mass Market & Fast Fashion
    {
        name: 'Myntra',
        category: 'Fast Fashion',
        specialization: ['Western Wear', 'Fusion', 'Marketplace'],
        priceRange: '₹500 - ₹10,000',
        regions: ['Online Pan-India'],
        founded: 2007,
        notableFor: 'Fashion e-commerce leader, private labels'
    },
    {
        name: 'Ajio',
        category: 'Fast Fashion',
        specialization: ['Western', 'Ethnic', 'Luxury Marketplace'],
        priceRange: '₹600 - ₹20,000',
        regions: ['Online Pan-India'],
        founded: 2016,
        notableFor: 'Reliance-backed, trendy curation'
    },
    {
        name: 'W for Woman',
        category: 'Mass Market',
        specialization: ['Ethnic Fusion', 'Workwear'],
        priceRange: '₹1,500 - ₹8,000',
        regions: ['Pan-India'],
        founded: 2001,
        notableFor: 'Modern Indian workwear for women'
    },
    {
        name: 'Biba',
        category: 'Mass Market',
        specialization: ['Ethnic Wear', 'Kurtas', 'Salwar Suits'],
        priceRange: '₹1,000 - ₹6,000',
        regions: ['Pan-India', '250+ stores'],
        founded: 1988,
        notableFor: 'Affordable ethnic fashion, festive collections'
    },
    {
        name: 'Global Desi',
        category: 'Mass Market',
        specialization: ['Bohemian', 'Fusion', 'Contemporary'],
        priceRange: '₹1,200 - ₹5,000',
        regions: ['Metro & Tier-1 cities'],
        founded: 2007,
        notableFor: 'Indo-western fusion, vibrant prints'
    },

    // Streetwear & Youth Brands
    {
        name: 'Bewakoof',
        category: 'Fast Fashion',
        specialization: ['Streetwear', 'Graphic Tees', 'Casual'],
        priceRange: '₹300 - ₹2,000',
        regions: ['Online Pan-India'],
        founded: 2012,
        notableFor: 'Youth-focused, pop culture references'
    },
    {
        name: 'Snitch',
        category: 'Fast Fashion',
        specialization: ['Menswear', 'Streetwear', 'Fast Fashion'],
        priceRange: '₹500 - ₹3,000',
        regions: ['Online'],
        founded: 2020,
        notableFor: 'Rapid trend adoption, influencer marketing'
    },
    {
        name: 'The Souled Store',
        category: 'Mass Market',
        specialization: ['Pop Culture Merchandise', 'Streetwear'],
        priceRange: '₹400 - ₹2,500',
        regions: ['Online Pan-India'],
        founded: 2013,
        notableFor: 'Licensed merchandise, fandom fashion'
    },

    // Sustainable & Ethical
    {
        name: 'No Nasties',
        category: 'Sustainable',
        specialization: ['Organic Cotton', 'Vegan Fashion'],
        priceRange: '₹1,000 - ₹4,000',
        regions: ['Online', 'Select stores'],
        founded: 2011,
        notableFor: 'Vegan, GOTS-certified organic cotton'
    },
    {
        name: 'Doodlage',
        category: 'Sustainable',
        specialization: ['Upcycled Fashion', 'Zero Waste'],
        priceRange: '₹2,000 - ₹10,000',
        regions: ['Delhi', 'Online'],
        founded: 2012,
        notableFor: 'Fabric upcycling, zero-waste design'
    },
    {
        name: 'Brown Boy',
        category: 'Sustainable',
        specialization: ['Khadi', 'Handloom', 'Menswear'],
        priceRange: '₹2,500 - ₹12,000',
        regions: ['Bangalore', 'Online'],
        founded: 2015,
        notableFor: 'Khadi revival, contemporary menswear'
    },

    // Athleisure & Activewear
    {
        name: 'HRX by Hrithik Roshan',
        category: 'Mass Market',
        specialization: ['Athleisure', 'Activewear'],
        priceRange: '₹800 - ₹4,000',
        regions: ['Myntra Exclusive'],
        founded: 2013,
        notableFor: 'Celebrity brand, fitness lifestyle'
    },
    {
        name: 'Alcis Sports',
        category: 'Mass Market',
        specialization: ['Activewear', 'Performance Wear'],
        priceRange: '₹1,000 - ₹5,000',
        regions: ['Pan-India'],
        founded: 2016,
        notableFor: 'Indian activewear alternative'
    },

    // Luxury International (India Operations)
    {
        name: 'Zara India',
        category: 'Premium',
        specialization: ['Fast Fashion', 'Western Wear'],
        priceRange: '₹2,000 - ₹15,000',
        regions: ['Metro cities'],
        founded: 2010,
        notableFor: 'International fast fashion leader in India'
    },
    {
        name: 'H&M India',
        category: 'Mass Market',
        specialization: ['Fast Fashion', 'Western Wear'],
        priceRange: '₹800 - ₹8,000',
        regions: ['Tier-1 & 2 cities'],
        founded: 2015,
        notableFor: 'Affordable international trends'
    }
];

/**
 * Get relevant Indian brands based on trend keywords
 */
export function getRelevantIndianBrands(trend: string, limit: number = 5): IndianBrand[] {
    const trendLower = trend.toLowerCase();

    // Calculate relevance score for each brand
    const scored = INDIAN_BRANDS.map(brand => {
        let score = 0;

        // Match specialization
        brand.specialization.forEach(spec => {
            if (trendLower.includes(spec.toLowerCase())) score += 3;
        });

        // Match category keywords
        if (trendLower.includes('luxury') || trendLower.includes('designer')) {
            if (brand.category === 'Luxury') score += 2;
        }
        if (trendLower.includes('sustain') || trendLower.includes('eco')) {
            if (brand.category === 'Sustainable' || brand.specialization.includes('Sustainable')) score += 3;
        }
        if (trendLower.includes('street') || trendLower.includes('casual')) {
            if (brand.specialization.some(s => s.includes('Streetwear'))) score += 2;
        }
        if (trendLower.includes('ethnic') || trendLower.includes('traditional')) {
            if (brand.specialization.includes('Ethnic')) score += 2;
        }
        if (trendLower.includes('athleisure') || trendLower.includes('sport')) {
            if (brand.specialization.some(s => s.includes('Athleisure') || s.includes('Activewear'))) score += 3;
        }

        // Favor well-known brands if no specific match
        if (score === 0 && ['Myntra', 'FabIndia', 'Biba', 'W for Woman'].includes(brand.name)) {
            score = 1;
        }

        return { brand, score };
    });

    // Sort by score and return top brands
    return scored
        .sort((a, b) => b.score - a.score)
        .slice(0, limit)
        .map(s => s.brand);
}

export default { INDIAN_BRANDS, getRelevantIndianBrands };
