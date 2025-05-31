
'use client';

import type { Review } from '@/types/reviews';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Star, MessageSquareText, CalendarDays, UserCircle, ClipboardCheck, Users, Radio, Brain } from 'lucide-react'; // Toegevoegde iconen voor subratings
import { format, parseISO } from 'date-fns';
import { nl } from 'date-fns/locale';

interface ReviewCardProps {
  review: Review;
}

export function ReviewCard({ review }: ReviewCardProps) {
  const displayRating = Math.round(review.rating / 2); 

  const formatDate = (dateString: string) => {
    try {
      return format(parseISO(dateString), 'dd MMMM yyyy', { locale: nl });
    } catch (e) {
      return dateString; 
    }
  };

  const getReviewerName = () => {
    if (!review.reviewer_name || review.reviewer_name.toLowerCase() === 'anoniem' || review.reviewer_name.toLowerCase() === 'aanhef') {
      return 'Anonieme Reviewer';
    }
    return review.reviewer_name;
  };
  
  const getReviewerTypeVariant = (type?: string): "default" | "secondary" | "outline" => {
    switch (type?.toLowerCase()) {
      case 'cursist':
        return 'default';
      case 'opdrachtgever':
        return 'secondary';
      case 'kandidaat':
        return 'outline';
      default:
        return 'default';
    }
  };

  const subratingIcons = {
    Begeleiding: <Users size={14} className="mr-1.5 text-primary/80" />,
    "Heldere communicatie": <MessageSquareText size={14} className="mr-1.5 text-primary/80" />,
    Enthousiasme: <ClipboardCheck size={14} className="mr-1.5 text-primary/80" />,
    Marktkennis: <Brain size={14} className="mr-1.5 text-primary/80" />,
  };

  const hasSubratings = review.subratings && Object.values(review.subratings).some(val => val !== undefined && val !== null);

  return (
    <Card className="flex flex-col h-full shadow-lg hover:shadow-xl transition-shadow duration-300 bg-card">
      <CardHeader className="pb-4">
        <div className="flex justify-between items-start mb-2">
          <div className="flex">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                className={`h-5 w-5 ${i < displayRating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`}
              />
            ))}
          </div>
          {review.reviewer_type && (
            <Badge variant={getReviewerTypeVariant(review.reviewer_type)} className="text-xs">
              {review.reviewer_type}
            </Badge>
          )}
        </div>
        <CardTitle className="text-lg font-semibold text-foreground leading-tight">{review.title}</CardTitle>
        <div className="text-xs text-muted-foreground flex items-center space-x-3 mt-1">
            <span className="flex items-center"><UserCircle size={14} className="mr-1" /> {getReviewerName()}</span>
            <span className="flex items-center"><CalendarDays size={14} className="mr-1" /> {formatDate(review.date)}</span>
        </div>
      </CardHeader>
      <CardContent className="flex-grow pb-4">
        <p className="text-sm text-muted-foreground leading-relaxed mb-4">{review.review_text}</p>
        
        {hasSubratings && (
          <div className="mt-4 pt-3 border-t border-border">
            <h4 className="text-xs font-semibold text-muted-foreground mb-2">Specifieke Beoordelingen:</h4>
            <ul className="space-y-1">
              {Object.entries(review.subratings || {}).map(([key, value]) => {
                if (value === undefined || value === null) return null;
                const TypedKey = key as keyof typeof subratingIcons;
                return (
                  <li key={key} className="text-xs text-muted-foreground flex items-center">
                    {subratingIcons[TypedKey] || <Star size={14} className="mr-1.5 text-primary/80" />} 
                    {key}: <span className="font-medium text-foreground ml-1">{value}/10</span>
                  </li>
                );
              })}
            </ul>
          </div>
        )}
      </CardContent>
      {review.response && (
        <CardFooter className="bg-primary/5 p-4 border-t mt-auto">
          <div className="w-full">
            <div className="flex items-center text-sm font-semibold text-primary mb-1">
              <MessageSquareText size={16} className="mr-2" />
              Reactie van FrisseStart:
            </div>
            <p className="text-xs text-muted-foreground italic">{review.response}</p>
          </div>
        </CardFooter>
      )}
    </Card>
  );
}
