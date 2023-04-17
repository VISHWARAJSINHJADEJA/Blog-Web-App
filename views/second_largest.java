public class a {
    public static void main(String[] args) {
        int [] arr = {12, 35, 1, 10, 34, 1};
        int max_1 = Integer.MIN_VALUE;
        int max_2 = Integer.MIN_VALUE;

        for(int i=0;i<arr.length;i++){
            if(arr[i]>max_1){
                max_1 = arr[i];
            }
        }
        for(int i=0;i<arr.length;i++){
            if(max_1!=arr[i]){
                if(arr[i]>max_2){
                    max_2 = arr[i];
                }
            }
        }
        System.out.println(max_2);
    }
}